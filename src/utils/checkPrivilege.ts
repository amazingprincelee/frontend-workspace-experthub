export function isActionChecked(
    action: string, 
    array?: { value: string; checked: boolean }[]
  ): boolean {
    // If the array is undefined, allow the user by default
    if (!array) {
      return true;
    }
  
    // Check for the action in the array and whether it is checked
    for (const item of array) {
      if (item.value === action && item.checked) {
        return true;
      }
    }
  
    // If no match is found or not checked, deny access
    alert("You do not have the permission to " + action);
    return false;
  }