import React from 'react'
import cell from './styles/cell.module.css';

export default function Cell( {details, updateFlag, revealcell} ) {
  // ADD COLOR VARIATION FOR EACH POSSIBLE NUMBER VALUE
  const SEVERITY = {
    1: 'limegreen',
    2: 'cyan',
    3: 'yellow',
    4: 'orange',
    5: 'orangered',
    6: 'firebrick',
    7: 'red',
    8: 'black',
  }  

  const style = {
      backgroundColor: details.revealed && details.value !== 0 ? details.value === 'X' ? 'red' : ' #00226d' : details.revealed && details.value===0 ? '#00226f' : '#000',
      opacity:'0.8',
      border:'3px solid white',
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      fontSize:'20px',
      cursor:'pointer',
      color: SEVERITY[details.value],
      fontWeight:'1000'
  }

  const click = () => {
        // calling revealcell for specific cell x and y
        revealcell(details.x,details.y);  
  }
    
  // Right Click Function
  
  const rightclick = (e) => {
      updateFlag(e, details.x, details.y)
  }
  // rendering the cell component and showing the different values on right and left clicks 
  
  return (
      <div style={style} className={cell.cell} onClick={click} onContextMenu={rightclick}>
          {!details.revealed && details.flagged ? (
      "🚩"
    ) : details.revealed && details.value !== 0 ? (
      details.value === "X" ? (
        "💣"
      ) : (
        details.value
      )
    ) : (
      ""
    )}
      </div>
  )
}


