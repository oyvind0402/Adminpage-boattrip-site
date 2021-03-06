using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SemesterOppgave2.Model
{
    public class PostPlace
    {
        [RegularExpression(@"^[1-9][0-9]{4}|[0-9]{4}|[1-9]{1}[0-9]{2}( )[0-9]{2}$")]
        public string ZipCode { get; set; }
        [RegularExpression(@"^[0-9a-zA-ZøæåØÆÅ. \-]{2,30}$")]
        public string City { get; set; }
        public override string ToString()
        {
            return "Postplace with ZipCode: " + ZipCode;
        }
    }
}
