import React from 'react';
import { motion } from 'framer-motion';
import styles from './CharacterSelection.module.css';

const CharacterDetails = ({ character, onClose, onConfirm }) => {
  // Backdrop animation
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 } 
    }
  };

  // Modal animation
  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 25,
        delay: 0.1
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      y: 30,
      transition: { duration: 0.2 } 
    }
  };

  return (
    <>
      <motion.div 
        className={styles.backdrop}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      />
      
      <motion.div 
        className={styles.detailsModal}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <div className={styles.detailsHeader}>
          <div 
            className={`${styles.detailsImage} ${styles[`faction-bg-${character.faction.toLowerCase()}`]}`}
            style={{ backgroundImage: `url(${character.image})` }}
          />
          
          <div className={styles.detailsHeaderInfo}>
            <h2 className={styles.detailsName}>{character.name}</h2>
            <div className={`${styles.detailsFactionBadge} ${styles[`faction-${character.faction.toLowerCase()}`]}`}>
              {character.faction}
            </div>
            <p className={styles.detailsOrigin}>Origin: {character.homeworld}</p>
            <p className={styles.detailsShip}>Ship: {character.shipType}</p>
          </div>
        </div>
        
        <div className={styles.detailsBio}>
          <h3>Background</h3>
          <p>{character.bio}</p>
        </div>
        
        <div className={styles.detailsSkills}>
          <h3>Skills & Abilities</h3>
          <div className={styles.detailsSkillsGrid}>
            {Object.entries(character.skills).map(([skill, value]) => (
              <div key={skill} className={styles.detailsSkillItem}>
                <div className={styles.detailsSkillName}>{skill}</div>
                <div className={styles.detailsSkillBarContainer}>
                  <motion.div
                    className={`${styles.detailsSkillBarFill} ${styles[`skill-${character.faction.toLowerCase()}`]}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${value * 10}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                  <span className={styles.detailsSkillValue}>{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.detailsSpecial}>
          <h3>Special Abilities</h3>
          <ul>
            {character.specialAbilities.map((ability, index) => (
              <li key={index} className={styles.specialAbility}>
                <span className={styles.abilityName}>{ability.name}:</span> {ability.description}
              </li>
            ))}
          </ul>
        </div>
        
        <div className={styles.detailsActions}>
          <button className={styles.backButton} onClick={onClose}>
            Go Back
          </button>
          <button 
            className={`${styles.confirmButton} ${styles[`btn-${character.faction.toLowerCase()}`]}`}
            onClick={onConfirm}
          >
            Begin Journey
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default CharacterDetails; 