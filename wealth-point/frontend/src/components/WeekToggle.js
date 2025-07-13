import React from 'react';

const WeekToggle = ({ currentWeek, onWeekChange }) => {
  return (
    <div className="toggle-group">
      <button 
        className={`toggle-btn ${currentWeek === 'week1' ? 'active' : ''}`}
        onClick={() => onWeekChange('week1')}
      >
        Week 1 Competition
      </button>
      <button 
        className={`toggle-btn ${currentWeek === 'week2' ? 'active' : ''}`}
        onClick={() => onWeekChange('week2')}
      >
        Week 2 Competition
      </button>
    </div>
  );
};

export default WeekToggle;
