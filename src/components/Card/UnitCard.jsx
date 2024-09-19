import React, { useEffect, useState, useQuery } from "react";
import { api_url, fetchLessonCardData } from "../../data/Data";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import { IoMdCloseCircle } from "react-icons/io";
import "react-circular-progressbar/dist/styles.css";

import "./UnitCard.css";

const lessonTypeDict = {
  0: "Introduction",
  1: "Practice",
  2: "Test",
};

const UnitCard = (props) => {
  const [expanded, setExpanded] = useState(false);
  return expanded ? (
    <ExpandedCard param={props} setExpanded={() => setExpanded(false)} />
  ) : (
    <CompactCard param={props} setExpanded={() => setExpanded(true)} />
  );
};

// Compact Card
function CompactCard({ param, setExpanded }) {
  const [expanded, setIsExpanded] = useState(false);

  const handleCompactCardClick = () => {
    setExpanded(!expanded);
  };

  const handleOutsideClick = (e) => {
    if (expanded && !e.target.closest('.popup-menu')) {
      setExpanded(false);
    }
  };

  const Png = param.icon;
  return (
    <>
      <div  onClick={handleCompactCardClick}>

        <div className="card__arrow"> p</div>
        <div className="cookieHeading">{param.title}</div>
        <div className="cookieDescription">
          <div className="card__arrow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16px" height="16px">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
            </svg>
          </div>
          <span>{param.description}</span>
        </div>
        <div className="radialBar">
          <CircularProgressbar
            value={param.progress}
            text={`${param.progress}%`}
          />
        </div>
      </div>
    </>
  );
}

// Expanded Card
function ExpandedCard({ param, setExpanded }) {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.ExpandedCard')) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [setExpanded]);


  useEffect(() => {
    const fetchLessons = async () => {
      const lessonData = await fetchLessonCardData(param.id).then((res) => res);
      setLessons(lessonData.data);
    };
    fetchLessons();
  }, []);
  return (
    <div className="body-blur">
    <div className="ExpandedCard">
      <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}>
        <IoMdCloseCircle onClick={() => setExpanded(false)} />
      </div>
      <span>{param.title}</span>
      <div className="lesson-access-container">
        {lessons
          ? lessons.map((lesson, index) => (
              <div
                key={lesson.lesson_id}
                className="unit-btn"
                onClick={() => {
                   navigate(`/lesson/unit/${param.id}/lesson/${index+1}/${lesson.lesson_id}`);
                }}
              >
                {`${lesson.lesson_id} - ${lessonTypeDict[lesson.lesson_type]}: ${lesson.title}`}
              </div>
            ))
          : "loading..."}
      </div>
    </div>
    </div>
  );
}

export default UnitCard;
