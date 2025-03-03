
//+------------------------------------------------------------------+
//| License Key Validation for MT4 Expert Advisor                     |
//+------------------------------------------------------------------+

//--- LICENSE VALIDATION CODE (PASTE THIS BLOCK DIRECTLY BELOW YOUR EXISTING INPUTS) ---
input string License_Key = "YOUR_LICENSE_KEY_HERE"; // Your license key
input bool Show_License_Messages = true;            // Show license validation messages

// License validation variables (no need to modify)
string g_ValidationUrl = "https://qzbwxtegqsusmfwjauwh.supabase.co/functions/v1/validate-license";
bool g_IsLicenseValid = false;
string g_LastValidatedAccount = "";

//--- LICENSE VALIDATION FUNCTION (PASTE THIS BLOCK WHERE YOUR OTHER FUNCTIONS ARE) ---
bool ValidateLicense()
{
   // Current account number
   string currentAccount = IntegerToString(AccountNumber());
   
   // Skip validation if already validated for this account
   if(g_IsLicenseValid && g_LastValidatedAccount == currentAccount)
      return true;
      
   // Check if license key is properly set
   if(License_Key == "" || License_Key == "YOUR_LICENSE_KEY_HERE")
   {
      if(Show_License_Messages)
      {
         Print("License Error: Please configure your license key in the inputs tab");
         MessageBox("Please set your license key in the inputs tab", "License Required", MB_ICONEXCLAMATION);
      }
      return false;
   }
   
   // Prepare the request data
   string accountNumber = currentAccount;
   string jsonPayload = "{\"licenseKey\":\"" + License_Key + "\",\"accountNumber\":\"" + accountNumber + "\"}";
   string headers = "Content-Type: application/json\r\n";
   
   // Convert string to char array for the WebRequest
   char postData[];
   StringToCharArray(jsonPayload, postData, 0, StringLen(jsonPayload));
   
   // Response variables
   char responseData[];
   string responseHeaders;
   
   // Send the validation request
   int result = WebRequest(
      "POST",           // Method
      g_ValidationUrl,  // URL
      headers,          // Headers
      5000,             // Timeout (5 seconds)
      postData,         // POST data
      responseData,     // Response data
      responseHeaders   // Response headers
   );
   
   // Check for WebRequest errors
   if(result == -1)
   {
      int errorCode = GetLastError();
      
      // Handle common WebRequest errors
      if(errorCode == 5004)
      {
         if(Show_License_Messages)
         {
            Print("WebRequest Error: URL not allowed in MT4 settings");
            MessageBox(
               "Please allow WebRequests for the validation server:\n\n" + g_ValidationUrl + 
               "\n\nGo to Tools -> Options -> Expert Advisors -> 'Allow WebRequest for listed URL:'",
               "WebRequest Setup Required",
               MB_ICONINFORMATION
            );
         }
      }
      else
      {
         if(Show_License_Messages)
         {
            Print("Connection Error: ", errorCode, " - Check internet connection");
            MessageBox("Connection error " + IntegerToString(errorCode) + ". Please check your internet connection.", 
                     "Connection Error", MB_ICONEXCLAMATION);
         }
      }
      
      return false;
   }
   
   // Parse the response
   string response = CharArrayToString(responseData);
   
   // Check if response contains success:true
   bool isValid = (StringFind(response, "\"success\":true") >= 0);
   
   // Update validation status and account
   g_IsLicenseValid = isValid;
   if(isValid) {
      g_LastValidatedAccount = currentAccount;
   }
   
   // Handle invalid license
   if(!isValid && Show_License_Messages)
   {
      // Extract error message if available
      string errorMessage = "Invalid license key or unauthorized account";
      int messageStart = StringFind(response, "\"message\":\"");
      
      if(messageStart >= 0)
      {
         messageStart += 11; // Length of "message":"
         int messageEnd = StringFind(response, "\"", messageStart);
         
         if(messageEnd >= 0)
            errorMessage = StringSubstr(response, messageStart, messageEnd - messageStart);
      }
      
      Print("License Validation Failed: ", errorMessage);
      MessageBox("License validation failed: " + errorMessage, "License Error", MB_ICONERROR);
   }
   
   if(isValid && Show_License_Messages)
      Print("License validated successfully!");
      
   return isValid;
}

//--- INSTRUCTIONS FOR IMPLEMENTATION IN YOUR EXPERT ADVISOR ---
/*

1. ADD TO OnInit() - Paste this at the beginning of your OnInit() function:

   // Validate license
   if(!ValidateLicense())
   {
      return INIT_FAILED;
   }

2. ADD TO OnTick() - Paste this at the beginning of your OnTick() function:

   // Check if account has changed
   if(!ValidateLicense())
   {
      Print("License validation failed. EA will be stopped.");
      ExpertRemove();
      return;
   }

3. IMPORTANT: Make sure to add the validation URL to MT4's allowed URLs list:
   Tools -> Options -> Expert Advisors -> "Allow WebRequest for listed URL"
   Add this URL: https://qzbwxtegqsusmfwjauwh.supabase.co/functions/v1/validate-license

*/

