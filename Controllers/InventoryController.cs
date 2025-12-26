using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ConsumablesApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InventoryController : ControllerBase
{
    private readonly string _inventoryFile = "inventory.json";
    private readonly ILogger<InventoryController> _logger;

    public InventoryController(ILogger<InventoryController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult GetInventory()
    {
        try
        {
            if (!System.IO.File.Exists(_inventoryFile))
            {
                return Ok(new { items = new List<object>(), lastUpdated = DateTime.UtcNow.ToString("o") });
            }

            var json = System.IO.File.ReadAllText(_inventoryFile);
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var inventory = JsonSerializer.Deserialize<Inventory>(json, options);
            return Ok(inventory);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reading inventory");
            return StatusCode(500, new { error = "Failed to read inventory" });
        }
    }

    [HttpPost("{itemId}")]
    public IActionResult UpdateInventory(string itemId, [FromBody] UpdateRequest request)
    {
        try
        {
            if (!System.IO.File.Exists(_inventoryFile))
            {
                return NotFound(new { error = "Inventory file not found" });
            }

            var json = System.IO.File.ReadAllText(_inventoryFile);
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var inventory = JsonSerializer.Deserialize<Inventory>(json, options);

            var item = inventory?.Items?.FirstOrDefault(i => i.Id == itemId);
            if (item == null)
            {
                return NotFound(new { error = "Item not found" });
            }

            if (request.Action == "update")
            {
                if (request.Name != null) item.Name = request.Name;
                if (request.Quantity != null) item.Quantity = request.Quantity;
                if (request.Group != null) item.Group = request.Group;
            }
            else
            {
                // Handle increment/decrement
                item.Quantity = UpdateQuantity(item.Quantity, request.Action);
            }

            inventory.LastUpdated = DateTime.UtcNow.ToString("o");
            System.IO.File.WriteAllText(_inventoryFile, JsonSerializer.Serialize(inventory, new JsonSerializerOptions { WriteIndented = true }));

            return Ok(new { success = true, item });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating inventory");
            return StatusCode(500, new { error = "Failed to update inventory" });
        }
    }

    [HttpPost]
    public IActionResult CreateItem([FromBody] CreateItemRequest request)
    {
        try
        {
            Inventory inventory;
            if (System.IO.File.Exists(_inventoryFile))
            {
                var json = System.IO.File.ReadAllText(_inventoryFile);
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                inventory = JsonSerializer.Deserialize<Inventory>(json, options) ?? new Inventory();
            }
            else
            {
                inventory = new Inventory { Items = new List<InventoryItem>() };
            }

            // Generate new ID
            var maxId = 0;
            if (inventory.Items != null)
            {
                foreach (var item in inventory.Items)
                {
                    if (item.Id?.StartsWith("item-") == true)
                    {
                        if (int.TryParse(item.Id.Split('-')[1], out int num))
                        {
                            maxId = Math.Max(maxId, num);
                        }
                    }
                }
            }

            var newItem = new InventoryItem
            {
                Id = $"item-{maxId + 1}",
                Name = request.Name ?? "",
                Quantity = request.Quantity ?? "0",
                Group = request.Group ?? ""
            };

            if (inventory.Items == null)
            {
                inventory.Items = new List<InventoryItem>();
            }
            inventory.Items.Add(newItem);
            inventory.LastUpdated = DateTime.UtcNow.ToString("o");

            System.IO.File.WriteAllText(_inventoryFile, JsonSerializer.Serialize(inventory, new JsonSerializerOptions { WriteIndented = true }));

            return Ok(new { success = true, item = newItem });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating item");
            return StatusCode(500, new { error = "Failed to create item" });
        }
    }

    [HttpDelete("{itemId}")]
    public IActionResult DeleteItem(string itemId)
    {
        try
        {
            if (!System.IO.File.Exists(_inventoryFile))
            {
                return NotFound(new { error = "Inventory file not found" });
            }

            var json = System.IO.File.ReadAllText(_inventoryFile);
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var inventory = JsonSerializer.Deserialize<Inventory>(json, options);

            if (inventory?.Items == null)
            {
                return NotFound(new { error = "Item not found" });
            }

            var item = inventory.Items.FirstOrDefault(i => i.Id == itemId);
            if (item == null)
            {
                return NotFound(new { error = "Item not found" });
            }

            inventory.Items.Remove(item);
            inventory.LastUpdated = DateTime.UtcNow.ToString("o");

            System.IO.File.WriteAllText(_inventoryFile, JsonSerializer.Serialize(inventory, new JsonSerializerOptions { WriteIndented = true }));

            return Ok(new { success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting item");
            return StatusCode(500, new { error = "Failed to delete item" });
        }
    }

    private string UpdateQuantity(string currentQty, string action)
    {
        if (string.IsNullOrEmpty(currentQty))
            return "0";

        // Check if it's a string starting with a number
        var trimmed = currentQty.Trim();
        var match = System.Text.RegularExpressions.Regex.Match(trimmed, @"^(\d+)\s*(.*)$");

        if (match.Success)
        {
            var number = int.Parse(match.Groups[1].Value);
            var unitText = match.Groups[2].Value.Trim();

            if (action == "increment")
            {
                number++;
            }
            else if (action == "decrement" && number > 0)
            {
                number--;
            }

            if (!string.IsNullOrEmpty(unitText))
            {
                return $"{number} {unitText}";
            }
            return number.ToString();
        }

        // Try to parse as pure number
        if (int.TryParse(trimmed, out int qty))
        {
            if (action == "increment")
                qty++;
            else if (action == "decrement" && qty > 0)
                qty--;
            return qty.ToString();
        }

        return "0";
    }
}

public class Inventory
{
    [JsonPropertyName("items")]
    public List<InventoryItem>? Items { get; set; }
    
    [JsonPropertyName("lastUpdated")]
    public string? LastUpdated { get; set; }
}

public class InventoryItem
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }
    
    [JsonPropertyName("name")]
    public string? Name { get; set; }
    
    [JsonPropertyName("quantity")]
    public string? Quantity { get; set; }
    
    [JsonPropertyName("group")]
    public string? Group { get; set; }
}

public class UpdateRequest
{
    public string? Action { get; set; }
    public string? Name { get; set; }
    public string? Quantity { get; set; }
    public string? Group { get; set; }
}

public class CreateItemRequest
{
    public string? Name { get; set; }
    public string? Quantity { get; set; }
    public string? Group { get; set; }
}

