using System.Text.Json;
using System.Text.RegularExpressions;

namespace ConsumablesApp;

public class CsvParser
{
    public static void ParseCsvToJson(string csvFile, string jsonFile)
    {
        var items = new List<InventoryItem>();
        int itemIndex = 0;

        var lines = System.IO.File.ReadAllLines(csvFile);
        string? currentItemName = null;

        for (int i = 1; i < lines.Length; i++)
        {
            var line = lines[i].Trim();
            if (string.IsNullOrEmpty(line))
                continue;

            if (currentItemName != null)
            {
                // Check if this line ends the item
                if (line.StartsWith("\";"))
                {
                    var rest = line.Substring(2);
                    var parts = rest.Split(';');
                    var quantity = parts.Length > 0 ? parts[0].Trim() : "";
                    var group = parts.Length > 1 ? parts[1].Trim() : "";

                    items.Add(new InventoryItem
                    {
                        Id = $"item-{++itemIndex}",
                        Name = currentItemName.Trim().Replace("  ", " "),
                        Quantity = quantity,
                        Group = group
                    });
                    currentItemName = null;
                }
                else
                {
                    currentItemName += " " + line;
                }
            }
            else
            {
                // Check if line starts with quote (multi-line item)
                if (line.StartsWith("\"") && !line.Contains("\";"))
                {
                    currentItemName = line.Substring(1).Trim();
                }
                else
                {
                    // Regular single-line entry
                    var parts = line.Split(';');
                    if (parts.Length >= 2)
                    {
                        var itemName = parts[0].Trim();
                        if (itemName.StartsWith("\"") && itemName.EndsWith("\""))
                        {
                            itemName = itemName.Substring(1, itemName.Length - 2);
                        }

                        var quantity = parts.Length > 1 ? parts[1].Trim() : "";
                        var group = parts.Length > 2 ? parts[2].Trim() : "";

                        if (!string.IsNullOrEmpty(itemName))
                        {
                            items.Add(new InventoryItem
                            {
                                Id = $"item-{++itemIndex}",
                                Name = itemName.Trim().Replace("  ", " "),
                                Quantity = quantity,
                                Group = group
                            });
                        }
                    }
                }
            }
        }

        // Handle any remaining item
        if (currentItemName != null)
        {
            items.Add(new InventoryItem
            {
                Id = $"item-{++itemIndex}",
                Name = currentItemName.Trim().Replace("  ", " "),
                Quantity = "0",
                Group = ""
            });
        }

        var inventory = new Inventory
        {
            Items = items,
            LastUpdated = DateTime.UtcNow.ToString("o")
        };

        var json = JsonSerializer.Serialize(inventory, new JsonSerializerOptions { WriteIndented = true });
        System.IO.File.WriteAllText(jsonFile, json);

        Console.WriteLine($"Successfully parsed {items.Count} items and created {jsonFile}");
    }
}

public class Inventory
{
    public List<InventoryItem>? Items { get; set; }
    public string? LastUpdated { get; set; }
}

public class InventoryItem
{
    public string? Id { get; set; }
    public string? Name { get; set; }
    public string? Quantity { get; set; }
    public string? Group { get; set; }
}

