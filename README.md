# PAM - Property Assistant Manager

This pet project is created in React Native using Expo CLI. 

Any other info will be written out at a future date.

================================================================================================================================================

# PAM Test Branch

# Beta Release v0.18.20210505
- Minor features
    - Allow the user to add additional images to their property within their expanded property content without having to go through the Edit screen
- Bug fixes
    - Made touching the vertical dots even easier when property is expanded.
    - Drastically reduced cloud storage bandwidth by only downloading images when new images are uploaded

# Beta Release v0.17.20210504
- Bug fixes
    - Fixed a bug that won't allow users that have more than one property to delete the last property
    - Fixed a bug when adding or editing a property with images, the 'Save' button would freeze up and show no loading icon
    - Made touching the vertical dots easier when property is expanded

# Beta Release v0.16.20210430
- Major feature
    - Added camera functionality
        - User can now capture images using their camera within the Add/Edit property modal
        - This can be accessed by clicking on the BIG Camera icon within the modal, and by selecting the 'Take photo' button
        - User can enable flash mode when taking pictures
        - User can preview the captured images and expand each image to full screen size, or remove an individual image
        - Removed retake and rotate functionality as it's unnecessary for now
    - Added image selection functionality using photo gallery
        - User can now select multiple images using their photo library within the Add/Edit property modal
        - This can be accessed by clicking on the BIG camera icon within the modal, and by selecting the 'Add from gallery' button
    - User can now upload multiple images tied to a specific property
    - When deleting the property, the images will be automatically deleted with the property

# Beta Release v0.15.20210425
- Bug fixes
    - Fixed a bug where pulling down to refresh on the home screen would cause a jumpy graphic glitch
    - Fixed a bug on the login screen where the 'Login' button would load infinite if the user made an error
    - Fixed a bug on property's content height to make it more dynamic when user is adding tenant/expense/income -- previously, this wasn't dynamic enough to automatically update

# Beta Release v0.14.20210424
- Minor Feature
    - User can now search for tenants in the search bar
- Bug fixes
    - Fixed a bug where duplicative tenants were added if user presses the 'Save' button more than once during loading
    - Disabled all buttons when loading is active 

# Beta Release v0.13.20210422
- Minor Feature
    - User is now able to search for a property based on the property's address, property's nickname and the unit type (apartment/condo, single fam house, etc.)
- Bugfixes
    - Fixed a bug where creating a tenant with a leading space in their name will cause them to appear as empty in the collapsed property card

# Beta Release v0.12.20210420
- Minor Feature
    - User is now able to remove - bulldoze - a property from the home screen
- Bug fixes
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
