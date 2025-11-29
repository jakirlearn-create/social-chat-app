/**
 * Generate searchable keywords for user search
 * Creates substrings, lowercase variants for fast Facebook-style search
 */

function generateSearchKeywords(user) {
  const keywords = new Set();
  
  // Helper function to add all substrings of a text
  const addSubstrings = (text) => {
    if (!text) return;
    
    const cleanText = text.toLowerCase().trim();
    
    // Add full text
    keywords.add(cleanText);
    
    // Add all substrings (minimum 2 characters)
    for (let i = 0; i < cleanText.length; i++) {
      for (let j = i + 2; j <= cleanText.length; j++) {
        keywords.add(cleanText.substring(i, j));
      }
    }
  };
  
  // Process name
  if (user.name) {
    addSubstrings(user.name);
    
    // Add name parts (for "Rahim Ahmed" -> add "rahim", "ahmed")
    const nameParts = user.name.toLowerCase().split(/\s+/);
    nameParts.forEach(part => {
      if (part.length >= 2) {
        addSubstrings(part);
      }
    });
  }
  
  // Process ID Number (username equivalent)
  if (user.idNumber) {
    addSubstrings(user.idNumber);
    keywords.add(`id${user.idNumber.toLowerCase()}`);
    keywords.add(`uid${user.idNumber.toLowerCase()}`);
  }
  
  // Process email (first part only)
  if (user.email) {
    const emailPart = user.email.split('@')[0].toLowerCase();
    addSubstrings(emailPart);
  }
  
  // Process phone (last 4-6 digits for quick search)
  if (user.phone) {
    const phoneClean = user.phone.replace(/\D/g, '');
    if (phoneClean.length >= 4) {
      keywords.add(phoneClean.slice(-4));
      keywords.add(phoneClean.slice(-6));
    }
  }
  
  // Convert Set to Array and filter out very short keywords
  return Array.from(keywords).filter(k => k.length >= 2);
}

module.exports = { generateSearchKeywords };
