using Newtonsoft.Json;

namespace ReadMeterApp.Models
{
    public class BlickerValidationError
    {
        [JsonProperty("detail")]
        public Detail[] Detail { get; set; }
    }

    public class Detail
    {
        [JsonProperty("loc")]
        public string[] Loc { get; set; }

        [JsonProperty("msg")]
        public string Msg { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }
    }
}
