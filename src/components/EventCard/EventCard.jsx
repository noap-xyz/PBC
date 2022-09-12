import React,{useEffect, useState} from 'react'
import "./EventCard.css"
import {useContract} from '../../hooks/useContract'
import NOAP from '../../contracts/NOAP.json'
import {Link, useNavigate} from 'react-router-dom'
import {motion} from 'framer-motion';

const eventCardVariant = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: { type: 'spring', delay: 1 }
  }
};


function EventCard({event}) {
  const navigate = useNavigate();
  const contract = useContract(NOAP);
  const [date,setDate] = useState('')
  const [description,setDescription] = useState('')
  const [name,setName] = useState('')

  const sendEventID = (id) => {
    navigate(`/events/${id}`, {eventId:id});
  }

  useEffect(() => {
    const getDatas = async() => {
      const date = await contract?.contract?.methods.getEventDate(event).call();
      const description = await contract?.contract?.methods
        .getEventDescription(event)
        .call();
      const name = await contract?.contract?.methods.getEventName(event).call();
      setName(name);
      setDescription(description);
      setDate(date);
    }

    getDatas()
  })

  
  return (
    <motion.div className="eventCard"
    variants={eventCardVariant}
    initial="hidden"
    animate="visible">
      <div className="date">
        <p>{date}</p>
        {/* <div className="lineDecocation"></div> */}
      </div>
      <div className="eventDescription">{description?.substring(0,80)+"..."}
      </div>
      <div className="eventImageName">
        <div className="eventImage"></div>
        <Link to={`/events/${event}`} state={{eventId: event}} style={{textDecoration:'none'}}>
          <div className="eventName">
            {name}
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

export default EventCard
