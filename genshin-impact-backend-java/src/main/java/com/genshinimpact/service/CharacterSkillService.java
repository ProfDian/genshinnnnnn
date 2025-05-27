package com.genshinimpact.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.genshinimpact.dto.character.BulkSkillsRequest;
import com.genshinimpact.dto.character.ConstellationRequest;
import com.genshinimpact.dto.character.PassiveRequest;
import com.genshinimpact.dto.character.TalentRequest;
import com.genshinimpact.model.CharacterConstellation;
import com.genshinimpact.model.CharacterPassive;
import com.genshinimpact.model.CharacterTalent;
import com.genshinimpact.repository.CharacterConstellationRepository;
import com.genshinimpact.repository.CharacterPassiveRepository;
import com.genshinimpact.repository.CharacterRepository;
import com.genshinimpact.repository.CharacterTalentRepository;

@Service
public class CharacterSkillService {

    @Autowired
    private CharacterRepository characterRepository;
    
    @Autowired
    private CharacterTalentRepository talentRepository;
    
    @Autowired
    private CharacterPassiveRepository passiveRepository;
    
    @Autowired
    private CharacterConstellationRepository constellationRepository;
    
    /**
     * Mendapatkan semua talents untuk karakter tertentu
     */
    public List<CharacterTalent> getCharacterTalents(int characterId) {
        return talentRepository.findByCharacterIdOrderByIdAsc(characterId);
    }
    
    /**
     * Mendapatkan semua passives untuk karakter tertentu
     */
    public List<CharacterPassive> getCharacterPassives(int characterId) {
        return passiveRepository.findByCharacterIdOrderByPassiveOrderAsc(characterId);
    }
    
    /**
     * Mendapatkan semua constellations untuk karakter tertentu
     */
    public List<CharacterConstellation> getCharacterConstellations(int characterId) {
        return constellationRepository.findByCharacterIdOrderByConstellationLevelAsc(characterId);
    }
    
    /**
     * Menambahkan talent untuk karakter
     */
    @Transactional
    public CharacterTalent addCharacterTalent(int characterId, TalentRequest request) {
        // Validasi input
        if (request.getTalentType() == null || request.getTalentName() == null) {
            throw new IllegalArgumentException("Talent type and name are required");
        }
        
        // Cek apakah karakter ada
        if (!characterRepository.existsById(characterId)) {throw new RuntimeException("Character not found with id: " + characterId);
}
        
        // Buat talent baru
        CharacterTalent talent = new CharacterTalent();
        talent.setCharacterId(characterId);
        talent.setTalentType(request.getTalentType());
        talent.setTalentName(request.getTalentName());
        talent.setTalentDescription(request.getTalentDescription());
        
        return talentRepository.save(talent);
    }
    
    /**
     * Menambahkan passive untuk karakter
     */
    @Transactional
    public CharacterPassive addCharacterPassive(int characterId, PassiveRequest request) {
        // Validasi input
        if (request.getPassiveName() == null || request.getPassiveOrder() < 0) {
            throw new IllegalArgumentException("Passive name and order are required");
        }
        
        // Cek apakah karakter ada
        if (!characterRepository.existsById(characterId)) {throw new RuntimeException("Character not found with id: " + characterId);
}
        
        // Buat passive baru
        CharacterPassive passive = new CharacterPassive();
        passive.setCharacterId(characterId);
        passive.setPassiveOrder(request.getPassiveOrder());
        passive.setPassiveName(request.getPassiveName());
        passive.setPassiveDescription(request.getPassiveDescription());
        passive.setUnlockLevel(request.getUnlockLevel());
        
        return passiveRepository.save(passive);
    }
    
    /**
     * Menambahkan constellation untuk karakter
     */
    @Transactional
    public CharacterConstellation addCharacterConstellation(int characterId, ConstellationRequest request) {
        // Validasi input
        if (request.getConstellationName() == null || request.getConstellationLevel() < 1 || request.getConstellationLevel() > 6) {
            throw new IllegalArgumentException("Constellation name and valid level (1-6) are required");
        }
        
        // Cek apakah karakter ada
        if (!characterRepository.existsById(characterId)) {throw new RuntimeException("Character not found with id: " + characterId);
}
        
        // Buat constellation baru
        CharacterConstellation constellation = new CharacterConstellation();
        constellation.setCharacterId(characterId);
        constellation.setConstellationLevel(request.getConstellationLevel());
        constellation.setConstellationName(request.getConstellationName());
        constellation.setConstellationDescription(request.getConstellationDescription());
        constellation.setConstellationIcon(request.getConstellationIcon());
        
        return constellationRepository.save(constellation);
    }
    
    /**
     * Bulk add talents, passives, dan constellations untuk karakter
     */
    @Transactional
    public BulkSkillsResult bulkAddCharacterSkills(int characterId, BulkSkillsRequest request) {
        // Validasi input
        if ((request.getTalents() == null || request.getTalents().isEmpty()) &&
            (request.getPassives() == null || request.getPassives().isEmpty()) &&
            (request.getConstellations() == null || request.getConstellations().isEmpty())) {
            throw new IllegalArgumentException("At least one of talents, passives, or constellations must be provided");
        }
        
        // Cek apakah karakter ada
       if (!characterRepository.existsById(characterId)) {throw new RuntimeException("Character not found with id: " + characterId);
}
        
        BulkSkillsResult result = new BulkSkillsResult();
        
        // Add talents if provided
        if (request.getTalents() != null && !request.getTalents().isEmpty()) {
            // Hapus talents yang ada
            talentRepository.deleteByCharacterId(characterId);
            
            // Buat talents baru
            List<CharacterTalent> talents = new ArrayList<>();
            for (TalentRequest talentRequest : request.getTalents()) {
                CharacterTalent talent = new CharacterTalent();
                talent.setCharacterId(characterId);
                talent.setTalentType(talentRequest.getTalentType());
                talent.setTalentName(talentRequest.getTalentName());
                talent.setTalentDescription(talentRequest.getTalentDescription());
                talents.add(talent);
            }
            result.setTalents(talentRepository.saveAll(talents));
        }
        
        // Add passives if provided
        if (request.getPassives() != null && !request.getPassives().isEmpty()) {
            // Hapus passives yang ada
            passiveRepository.deleteByCharacterId(characterId);
            
            // Buat passives baru
            List<CharacterPassive> passives = new ArrayList<>();
            for (PassiveRequest passiveRequest : request.getPassives()) {
                CharacterPassive passive = new CharacterPassive();
                passive.setCharacterId(characterId);
                passive.setPassiveOrder(passiveRequest.getPassiveOrder());
                passive.setPassiveName(passiveRequest.getPassiveName());
                passive.setPassiveDescription(passiveRequest.getPassiveDescription());
                passive.setUnlockLevel(passiveRequest.getUnlockLevel());
                passives.add(passive);
            }
            result.setPassives(passiveRepository.saveAll(passives));
        }
        
        // Add constellations if provided
        if (request.getConstellations() != null && !request.getConstellations().isEmpty()) {
            // Hapus constellations yang ada
            constellationRepository.deleteByCharacterId(characterId);
            
            // Buat constellations baru
            List<CharacterConstellation> constellations = new ArrayList<>();
            for (ConstellationRequest constellationRequest : request.getConstellations()) {
                CharacterConstellation constellation = new CharacterConstellation();
                constellation.setCharacterId(characterId);
                constellation.setConstellationLevel(constellationRequest.getConstellationLevel());
                constellation.setConstellationName(constellationRequest.getConstellationName());
                constellation.setConstellationDescription(constellationRequest.getConstellationDescription());
                constellation.setConstellationIcon(constellationRequest.getConstellationIcon());
                constellations.add(constellation);
            }
            result.setConstellations(constellationRepository.saveAll(constellations));
        }
        
        return result;
    }
    
    // Helper class untuk hasil bulk add
    public static class BulkSkillsResult {
        private List<CharacterTalent> talents = new ArrayList<>();
        private List<CharacterPassive> passives = new ArrayList<>();
        private List<CharacterConstellation> constellations = new ArrayList<>();
        
        public List<CharacterTalent> getTalents() {
            return talents;
        }
        
        public void setTalents(List<CharacterTalent> talents) {
            this.talents = talents;
        }
        
        public List<CharacterPassive> getPassives() {
            return passives;
        }
        
        public void setPassives(List<CharacterPassive> passives) {
            this.passives = passives;
        }
        
        public List<CharacterConstellation> getConstellations() {
            return constellations;
        }
        
        public void setConstellations(List<CharacterConstellation> constellations) {
            this.constellations = constellations;
        }
    }
}