using System;
using ReadMeterApp.Models;

namespace ReadMeterApp.Exceptions
{
    public class BlickerApiValidationException : Exception
    {
        public BlickerApiValidationException(BlickerApiValidationError validationError)
        {
            ValidationError = validationError;
        }

        public BlickerApiValidationError ValidationError { get; set; }
    }
}
