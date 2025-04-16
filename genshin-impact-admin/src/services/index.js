// Export all services from a single file for easy importing

import api from "./api";
import authService from "./authService";
import characterService from "./characterService";
import characterSkillsService from "./characterSkillsService";
import characterStatService from "./characterStatService";
import referenceDataService from "./referenceDataService";
import regionService from "./regionService";
import searchService from "./searchService";
import userService from "./userService";
import weaponService from "./weaponService";

export {
  api,
  authService,
  characterService,
  characterSkillsService,
  characterStatService,
  referenceDataService,
  regionService,
  searchService,
  userService,
  weaponService,
};
