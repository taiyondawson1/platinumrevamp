
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
   // Display license information
   Print("MT4 License Validator initializing...");
   Print("License Key: ", LicenseKey);
   Print("Account Number: ", AccountNumber());
   
   // Check if license key is valid
   IsValidLicense = ValidateLicense();
   
   if(!IsValidLicense)
   {
      Print("License validation failed. Please check your license key and account number.");
      MessageBox("License validation failed. Please check your license key in the inputs tab and ensure your MT4 account is authorized.", "License Error", MB_ICONERROR);
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
   Print("MT4 License Validator stopped");
}

//+------------------------------------------------------------------+
//| Expert tick function                                               |
//+------------------------------------------------------------------+
void OnTick()
{
   // Periodically revalidate license
   if(TimeCurrent() - LastValidationTime > RevalidationInterval)
   {
      Print("Revalidating license...");
      IsValidLicense = ValidateLicense();
      LastValidationTime = TimeCurrent();
      
      if(!IsValidLicense)
      {
         Print("License validation failed. Stopping EA.");
         MessageBox("Your license is no longer valid. The EA will be stopped.", "License Error", MB_ICONERROR);
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
      Print("Please set your license key in the inputs tab");
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
   
   Print("Sending license validation request to: ", ValidationUrl);
   Print("Payload: ", jsonPayload);
   
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
         MessageBox("WebRequest is not allowed. Please add this URL to the allowed list in MT4 settings:\n\n" + ValidationUrl + "\n\nGo to Tools -> Options -> Expert Advisors -> 'Allow WebRequest for listed URL:'", "WebRequest Error", MB_ICONEXCLAMATION);
      }
      else
      {
         Print("Connection error. Please check your internet connection.");
         MessageBox("Connection error " + IntegerToString(errorCode) + ". Please check your internet connection.", "Connection Error", MB_ICONEXCLAMATION);
      }
      
      return false;
   }
   
   // Parse the response
   string response = CharArrayToString(responseData);
   Print("License validation response: ", response);
   
   // Check if the response contains "success":true
   if(StringFind(response, "\"success\":true") >= 0)
   {
      Print("License validated successfully!");
      return true;
   }
   else
   {
      // Extract error message if available
      int messageStart = StringFind(response, "\"message\":\"");
      if(messageStart >= 0)
      {
         messageStart += 11; // Length of "message":"
         int messageEnd = StringFind(response, "\"", messageStart);
         if(messageEnd >= 0)
         {
            string errorMessage = StringSubstr(response, messageStart, messageEnd - messageStart);
            Print("License validation failed: ", errorMessage);
            MessageBox("License validation failed: " + errorMessage, "License Error", MB_ICONERROR);
         }
      }
      return false;
   }
}

//+------------------------------------------------------------------+
