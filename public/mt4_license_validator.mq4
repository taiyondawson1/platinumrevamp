
//+------------------------------------------------------------------+
//| License Key Validation for MT4 Expert Advisor                     |
//+------------------------------------------------------------------+

// License Key Configuration
string LicenseKey = "YOUR_LICENSE_KEY_HERE";  // Replace with your license key
string ValidationUrl = "https://qzbwxtegqsusmfwjauwh.supabase.co/functions/v1/validate-license";
bool IsValidLicense = false;
int RevalidationInterval = 3600;  // Revalidate every hour (in seconds)
datetime LastValidationTime = 0;

//+------------------------------------------------------------------+
//| Expert initialization function                                     |
//+------------------------------------------------------------------+
int OnInit()
{
   // Check if license key is valid
   IsValidLicense = ValidateLicense();
   
   if(!IsValidLicense)
   {
      Print("License validation failed. Please check your license key and account number.");
      return INIT_FAILED;
   }
   
   Print("License validated successfully!");
   LastValidationTime = TimeCurrent();
   
   // Continue with the rest of your initialization code
   return INIT_SUCCEEDED;
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                   |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   // Clean up resources
   IsValidLicense = false;
}

//+------------------------------------------------------------------+
//| Expert tick function                                               |
//+------------------------------------------------------------------+
void OnTick()
{
   // Periodically revalidate license
   if(TimeCurrent() - LastValidationTime > RevalidationInterval)
   {
      IsValidLicense = ValidateLicense();
      LastValidationTime = TimeCurrent();
      
      if(!IsValidLicense)
      {
         Print("License validation failed. Stopping EA.");
         ExpertRemove();
         return;
      }
   }
   
   // Your trading logic goes here
   // ...
}

//+------------------------------------------------------------------+
//| License validation function                                        |
//+------------------------------------------------------------------+
bool ValidateLicense()
{
   if(LicenseKey == "" || LicenseKey == "YOUR_LICENSE_KEY_HERE")
   {
      Print("Please set your license key");
      return false;
   }
   
   string accountNumber = IntegerToString(AccountNumber());
   
   // Construct the JSON payload
   string jsonPayload = "{\"licenseKey\":\"" + LicenseKey + "\",\"accountNumber\":\"" + accountNumber + "\"}";
   
   // Headers for the HTTP request
   string headers = "Content-Type: application/json\r\n";
   
   char responseData[];
   char postData[];
   StringToCharArray(jsonPayload, postData, 0, StringLen(jsonPayload));
   
   // Make the HTTP request
   int result = WebRequest(
      "POST",            // Method
      ValidationUrl,     // URL
      headers,           // Headers
      5000,              // Timeout
      postData,          // POST data
      responseData,      // Response data
      string           // Response headers (not used)
   );
   
   // Check for errors
   if(result == -1)
   {
      int errorCode = GetLastError();
      Print("HTTP request failed with error code: ", errorCode);
      
      // Common WebRequest errors:
      // 4060: Cannot connect to server
      // 4067: HTTP request failed
      // 5004: WebRequest function is not allowed. Add URL to allowed list
      
      if(errorCode == 5004)
      {
         Print("WebRequest is not allowed for URL ", ValidationUrl);
         Print("Please add this URL to the list of allowed URLs in MT4 -> Tools -> Options -> Expert Advisors -> 'Allow WebRequest for listed URL:'");
      }
      
      return false;
   }
   
   // Parse the response
   string response = CharArrayToString(responseData);
   Print("License validation response: ", response);
   
   // Check if the response contains "success":true
   if(StringFind(response, "\"success\":true") >= 0)
   {
      return true;
   }
   
   return false;
}

//+------------------------------------------------------------------+
