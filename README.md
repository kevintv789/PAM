# PAM Test Branch

# Beta Release v0.12.20210420
- Minor Feature
    - User is now able to remove - bulldoze - a property from the home screen
- Bugfixes
    - Fixed a bug related to memory leak during deletion of a single property
    - Fixed styling issues within the report section of the collapsed property card
    - Fixed styling issue with the vertical ellipses button on the property card and made the touch area a bit bigger
    - Made the tooltip height and content a bit bigger 
    - Fixed currency input styling on some pages to make it look consistent with other inputs

# Beta Release v0.11
- Bug Fixes
    - Fixed crash when editing a tenant
    - Fixed data sync issue where tenant and financial data were overtaking a newly added property
    - Fixed data sync issue where tenants weren't being updated when first added to properties that previously had no tenants
    - Fixed weird sorting of a newly added property by automatically sorting to the most recent addition first

# Beta Release v0.1
- Major features
    - User is now able to Sign up for a usable account and log into it with fresh data
    - Creating and editing a property from the home screen
    - Creating and editing a tenant from a property
    - Creating and editing a property’s financial information, such as its Income and Expenses
- Minor Features
    - Added in a pull-up refresh on the home screen
    - Added in an Autofill checkbox on the Address input, so users can add in their own custom address
- Bug fixes
    - Fixed data issue where tenants weren’t being loaded onto their correctly assigned property
    - Fixed data sync for tenants, properties and financials, so the data will properly be updated when the user does an action
    - Fixed some crashes and deprecation warning issues
    - Fixed height styling issues when user has expanded a property, so now users can have more bandwidth to work with
    - Fixed minor data bugs when editing tenants
