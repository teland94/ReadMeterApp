using System;
using ReadMeterApp.Models;

namespace ReadMeterApp.Exceptions
{
    public class BlickerApiException : Exception
    {
        public BlickerApiException(BlickerApiError error)
        {
            Error = error;
        }

        public BlickerApiError Error { get; set; }
    }
}
