namespace ReadMeterApp.Models
{
    public class ReadMeterResult
    {
        public string MeterCategory { get; set; }

        public string DisplayType { get; set; }

        public object[] Messages { get; set; }

        public string DisplayValue { get; set; }
    }
}
