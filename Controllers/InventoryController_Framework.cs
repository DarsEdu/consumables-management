using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Http;
using Newtonsoft.Json;

namespace ConsumablesApp.Controllers
{
    [RoutePrefix("api/inventory")]
    public class InventoryController : ApiController
    {
        private readonly string _inventoryFile;

        public InventoryController()
        {
            var appPath = HttpContext.Current.Server.MapPath("~");
            _inventoryFile = Path.Combine(appPath, "inventory.json");
        }

        [HttpGet]
        [Route("")]
        public IHttpActionResult GetInventory()
        {
            try
            {
                if (!File.Exists(_inventoryFile))
                {
                    return Ok(new { items = new List<object>(), lastUpdated = DateTime.UtcNow.ToString("o") });
                }

                var json = File.ReadAllText(_inventoryFile);
                var inventory = JsonConvert.DeserializeObject<Inventory>(json);
                return Ok(inventory);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("{itemId}")]
        public IHttpActionResult UpdateInventory(string itemId, [FromBody] UpdateRequest request)
        {
            try
            {
                if (!File.Exists(_inventoryFile))
                {
                    return NotFound();
                }

                var json = File.ReadAllText(_inventoryFile);
                var inventory = JsonConvert.DeserializeObject<Inventory>(json);

                var item = inventory?.Items?.FirstOrDefault(i => i.Id == itemId);
                if (item == null)
                {
                    return NotFound();
                }

                if (request?.Action == "update")
                {
                    if (request.Name != null) item.Name = request.Name;
                    if (request.Quantity != null) item.Quantity = request.Quantity;
                    if (request.Group != null) item.Group = request.Group;
                }
                else
                {
                    item.Quantity = UpdateQuantity(item.Quantity, request?.Action);
                }

                inventory.LastUpdated = DateTime.UtcNow.ToString("o");
                File.WriteAllText(_inventoryFile, JsonConvert.SerializeObject(inventory, Formatting.Indented));

                return Ok(new { success = true, item });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("")]
        public IHttpActionResult CreateItem([FromBody] CreateItemRequest request)
        {
            try
            {
                Inventory inventory;
                if (File.Exists(_inventoryFile))
                {
                    var json = File.ReadAllText(_inventoryFile);
                    inventory = JsonConvert.DeserializeObject<Inventory>(json) ?? new Inventory();
                }
                else
                {
                    inventory = new Inventory { Items = new List<InventoryItem>() };
                }

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
                    Name = request?.Name ?? "",
                    Quantity = request?.Quantity ?? "0",
                    Group = request?.Group ?? ""
                };

                if (inventory.Items == null)
                {
                    inventory.Items = new List<InventoryItem>();
                }
                inventory.Items.Add(newItem);
                inventory.LastUpdated = DateTime.UtcNow.ToString("o");

                File.WriteAllText(_inventoryFile, JsonConvert.SerializeObject(inventory, Formatting.Indented));

                return Ok(new { success = true, item = newItem });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpDelete]
        [Route("{itemId}")]
        public IHttpActionResult DeleteItem(string itemId)
        {
            try
            {
                if (!File.Exists(_inventoryFile))
                {
                    return NotFound();
                }

                var json = File.ReadAllText(_inventoryFile);
                var inventory = JsonConvert.DeserializeObject<Inventory>(json);

                if (inventory?.Items == null)
                {
                    return NotFound();
                }

                var item = inventory.Items.FirstOrDefault(i => i.Id == itemId);
                if (item == null)
                {
                    return NotFound();
                }

                inventory.Items.Remove(item);
                inventory.LastUpdated = DateTime.UtcNow.ToString("o");

                File.WriteAllText(_inventoryFile, JsonConvert.SerializeObject(inventory, Formatting.Indented));

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        private string UpdateQuantity(string currentQty, string action)
        {
            if (string.IsNullOrEmpty(currentQty))
                return "0";

            var trimmed = currentQty.Trim();
            var match = Regex.Match(trimmed, @"^(\d+)\s*(.*)$");

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
        [JsonProperty("items")]
        public List<InventoryItem> Items { get; set; }

        [JsonProperty("lastUpdated")]
        public string LastUpdated { get; set; }
    }

    public class InventoryItem
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("quantity")]
        public string Quantity { get; set; }

        [JsonProperty("group")]
        public string Group { get; set; }
    }

    public class UpdateRequest
    {
        [JsonProperty("action")]
        public string Action { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("quantity")]
        public string Quantity { get; set; }

        [JsonProperty("group")]
        public string Group { get; set; }
    }

    public class CreateItemRequest
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("quantity")]
        public string Quantity { get; set; }

        [JsonProperty("group")]
        public string Group { get; set; }
    }
}
