// If # of daily impressions fall below 50% of daily goal == Priority #2

// Refactor to be single account
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
    
    var currentAccount = AdWordsAp.currentAccount();
    var currentAccountName = currentAccount.getName();
    Logger.log("Current Account Processed: " + currentAccountName)
    var campaignSelector = AdWordsApp
    .campaigns()
    .withCondition("Status = ENABLED")
    .forDateRange("THIS_MONTH")
    var campaignIterator = campaignSelector.get();
    while(campaignIterator.hasNext()) {
        var campaign = campaignIterator.next()
        var currentCampaign = campaign.getName();
        var currentCampaignImpressions = campaign.getImpressions();
        var orderedImpressions = 120000;
        var daysRemaining = 232;
        var impressionsRemaining = orderedImpressions - currentCampaignImpressions;
        var dailyImpressions = impressionsRemaining / daysRemaining;
        var belowFifty = dailyImpressions * .50;
        
        if(dailyImpressions < belowFifty) {
            // ALERT EMPLOYEE = Notify Function
            Logger.log("=======================================");
            Logger.log("Account Flagged: " + currentAccountName);
            
        }
    }    
}

