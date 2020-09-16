using System;
using Newtonsoft.Json;

namespace ReadMeterApp.Models
{
    public class BlickerResult
    {
        [JsonProperty("apiVersion")]
        public DateTimeOffset ApiVersion { get; set; }

        [JsonProperty("language")]
        public string Language { get; set; }

        [JsonProperty("messages")]
        public ServiceMessage[] Messages { get; set; }

        [JsonProperty("metaData")]
        public MetaData MetaData { get; set; }

        [JsonProperty("objects")]
        public BlickerResultObjects Objects { get; set; }

        [JsonProperty("requestId")]
        public Guid RequestId { get; set; }
    }

    public class ServiceMessage
    {
        [JsonProperty("code")]
        public string Code { get; set; }

        [JsonProperty("messageId")]
        public string MessageId { get; set; }

        [JsonProperty("message")]
        public string Message { get; set; }

        [JsonProperty("objectId")]
        public string ObjectId { get; set; }
    }

    public class MetaData
    {
        [JsonProperty("GPSInfo")]
        public GpsInfo GpsInfo { get; set; }

        [JsonProperty("datetime")]
        public DateTime? Datetime { get; set; }
    }

    public class GpsInfo
    {
        [JsonProperty("GPSLatitude")]
        public long? GpsLatitude { get; set; }

        [JsonProperty("GPSLongitude")]
        public long? GpsLongitude { get; set; }

        [JsonProperty("GPSAltitude")]
        public long? GpsAltitude { get; set; }
    }

    public class BlickerResultObjects
    {
        [JsonProperty("meter")]
        public Meter[] Meter { get; set; }
    }

    public class Meter
    {
        [JsonProperty("meterCategory")]
        public string MeterCategory { get; set; }

        [JsonProperty("displayType")]
        public string DisplayType { get; set; }

        [JsonProperty("messages")]
        public string[] Messages { get; set; }

        [JsonProperty("objectId")]
        public string ObjectId { get; set; }

        [JsonProperty("objects")]
        public MeterObjects Objects { get; set; }
    }

    public class MeterObjects
    {
        [JsonProperty("display")]
        public Display[] Display { get; set; }

        [JsonProperty("serialNumber")]
        public SerialNumber[] SerialNumber { get; set; }

        [JsonProperty("barcode")]
        public object[] Barcode { get; set; }
    }

    public class SerialNumber
    {
        [JsonProperty("confidence")]
        public string Confidence { get; set; }

        [JsonProperty("index")]
        public long Index { get; set; }

        [JsonProperty("messages")]
        public string[] Messages { get; set; }

        [JsonProperty("objectId")]
        public string ObjectId { get; set; }

        [JsonProperty("value")]
        public string Value { get; set; }
    }

    public class Display
    {
        [JsonProperty("confidence")]
        public string Confidence { get; set; }

        [JsonProperty("index")]
        public long Index { get; set; }

        [JsonProperty("messages")]
        public string[] Messages { get; set; }

        [JsonProperty("objectId")]
        public string ObjectId { get; set; }

        [JsonProperty("value")]
        public string Value { get; set; }
    }
}
