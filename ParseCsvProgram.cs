using ConsumablesApp;

if (args.Length > 0 && args[0] == "parse")
{
    CsvParser.ParseCsvToJson("Urunler.csv", "inventory.json");
}
else
{
    Console.WriteLine("Usage: dotnet run -- parse");
}

