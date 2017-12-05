// If # of daily impressions fall below 50% of daily goal == Priority #2

// Refactor to be run on multiple accounts
// Select Current Account - Display - Done
// Calculate Daily Impression Goal
    // impressions remaining for the month / days remaining before end of the month = estimated daily impressions needed per day
    // Has to tie in with a spreadsheet to get values for calculation
    // Create a ss for value entry?
    // Use budget script calculations as a guide
// Condition to check if the value is below 50% of the daily goal
    // If it is log the account/campaign/impressions
    // Notify the provided employee to take a look at the account

    
function main() {

    var spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1Z-l1kE6qMWSHKjfCCUISCAoxCuZDwg1T4mPfLzE9hwc/edit?usp=sharing';
    
    var columns = {
        id: 1,
        name: 2,
        endDate: 4,
        orderedImp: 6,
        dailyImp: 7,
        below: 8
    };
    
    var startRow = 2;
    
    
    Logger.log('Using spreadsheet - %s.', spreadsheetUrl);
    var spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);
    var sheet = spreadsheet.getSheets()[0];
    
    var endRow = sheet.getLastRow();
    
    // var accountName = sheet.getRange(ROW, COLUMN.accountName).getValue();

    // var budgetRange = sheet.getRange(13, 2);
    // var budgetArray = [[currentDailyBudget]]
    // budgetRange.setValues(budgetArray);
    
    var currentAccount = AdWordsApp.currentAccount();
    var currentAccountName = currentAccount.getName();
    var accountNameRange = sheet.getRange(2,2);
    var accountNameArray = [[currentAccountName]];
    accountNameRange.setValues(accountNameArray);
    var currentAccountId = currentAccount.getCustomerId();
    var accountIdRange = sheet.getRange(2,1);
    var accountIdArray = [[currentAccountId]];
    accountIdRange.setValues(accountIdArray);
    Logger.log("Current Account Processed: " + currentAccountName)
    var campaignSelector = AdWordsApp
    .campaigns()
    .withCondition("Status = ENABLED")
    .forDateRange("THIS_MONTH")
    var campaignIterator = campaignSelector.get();
    while(campaignIterator.hasNext()) {
        var campaign = campaignIterator.next()
        var currentCampaign = campaign.getName();
        var campaignStats = campaign.getStatsFor("THIS_MONTH");
        var currentCampaignImpressions = campaignStats.getImpressions();
        Logger.log("current impressions: " + currentCampaignImpressions);
        var orderedImpressions = sheet.getRange(2,6).getValue();
        Logger.log("ordered impressions: " + orderedImpressions);
        var daysRemaining = sheet.getRange(2, 5).getValue();
        var impressionsRemaining = orderedImpressions - currentCampaignImpressions;
        Logger.log("impressions remaining: " + impressionsRemaining);
        var dailyImpressions = impressionsRemaining / daysRemaining;
        dailyImpressions = dailyImpressions.toFixed(0);
        Logger.log("daily imp: " + dailyImpressions);
        var dailyImpRange = sheet.getRange(2, 7);
        var dailyImpArray = [[dailyImpressions]];
        dailyImpRange.setValues(dailyImpArray);
        var belowFifty = dailyImpressions * .50;
        Logger.log("Below 50 calculation: " + belowFifty);
        
        if(dailyImpressions < belowFifty) {
            // ALERT EMPLOYEE = Notify Function
            Logger.log("=======================================");
            Logger.log("Account Flagged: " + currentAccountName);
            var belowFiftyRange = sheet.getRange(2, 8);
            var yesArray = [["Yes"]];
            belowFiftyRange.setValue(yesArray);
        } else {
            Logger.log("Not below 50% - That's Good!");
            var okayRange = sheet.getRange(2, 8);
            var noArray = [["No"]];
           	okayRange.setValue(noArray);
        }
    }    
}

