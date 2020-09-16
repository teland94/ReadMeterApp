using Newtonsoft.Json;

namespace ReadMeterApp.Models
{
    public class BlickerApiError
    {
        [JsonProperty("detail")]
        public string Detail { get; set; }
    }
}
