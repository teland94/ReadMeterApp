using System;
using ReadMeterApp.Models;

namespace ReadMeterApp.Exceptions
{
    public class BlickerApiException : Exception
    {
        public BlickerApiException(BlickerValidationError validationError)
        {
            ValidationError = validationError;
        }

        public BlickerValidationError ValidationError { get; set; }
    }
}
