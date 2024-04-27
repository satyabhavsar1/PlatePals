// import React, { useState } from 'react'
import './css/flashcards.css'
// import Switch from 'react-ios-switch'
import React, { useState, useMemo, useRef } from 'react'
import TinderCard from 'react-tinder-card'
import { useNavigate } from 'react-router-dom';

// import Advanced from './examples/Advanced'
// import Simple from './examples/Simple'


const db = [
  {
    name: '',
    url: './img/SeaFood.JPG'
  },
  {
    name: '',
    url: './img/Vegan.JPG'
  },
  {
    name: '',
    url: './img/Vegetarian.JPG'
  },
  {
    name: '',
    url: './img/Italian.JPG'
  },
  {
    name: '',
    url: './img/Brunch.JPG'
  },
  {
    name: '',
    url: './img/Mexican.JPG'
  },
  {
    name: '',
    url: './img/MiddleEast.JPG'
  },
  {
    name: '',
    url: './img/NightLife.JPG'
  },
  {
    name: '',
    url: './img/Cafe.JPG'
  },
  {
    name: '',
    url: './img/Asian.JPG'
  },
  {
    name: '',
    url: './img/American.JPG'
  },
  {
    name: '',
    url: './img/Japanese.JPG'
  },
  {
    name: '',
    url: './img/Delis.JPG'
  },
  {
    name: '',
    url: './img/Desserts.JPG'
  },
  {
    name: '',
    url: './img/Alcohol.JPG'
  }
]

function FlashCards () {

  const [currentIndex, setCurrentIndex] = useState(db.length - 1)
  const [lastDirection, setLastDirection] = useState()
  const [roomCode, setRoomCode] = useState(localStorage.getItem('code'));
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const navigate = useNavigate();

  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex)

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );
  const [swipeValues, setSwipeValues] = useState([]);
  const [showSubmitButton, setShowSubmitButton] = useState(false); // State to control the visibility of the submit button
  const [swipeCount, setSwipeCount] = useState(0); // Track the number of swipes

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < db.length - 1;

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
    setSwipeValues((prevValues) => [...prevValues, direction === 'right' ? 1 : 0]);
    setSwipeCount((prevCount) => prevCount + 1); // Increment swipe count

    if (index === db.length - 1) {
      // Check if all cards have been swiped
      setShowSubmitButton(true); // Show the submit button when all cards have been swiped
    }
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return
    const newIndex = currentIndex + 1
    updateCurrentIndex(newIndex)
    await childRefs[newIndex].current.restoreCard()
    // Remove the last value from swipeValues
    setSwipeValues(prevValues => prevValues.slice(0, -1));
  }

    // Function to check if all cards have been swiped
  const checkAllSwiped = () => {
    return currentIndex === -1;
  };

  const handleSubmit = () => {
    // Handle submission logic here

    const userDataJSON = localStorage.getItem('userData');
    const userData = JSON.parse(userDataJSON);
    const firstName = userData.firstName;
    const lastName = userData.lastName;
    console.log("User:", firstName, lastName);
    console.log('Submitting swipe values:', swipeValues);
    fetch('http://localhost:8000/api/add_ans/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({'first_name': firstName, 'last_name': lastName, 'code':roomCode, 'ans':swipeValues}),
    }).then((response) => {
        return response.json(); // Parse the JSON response
    }).then((data) => {
        // Handle the response data
        if (data.success) {
            setSnackbarType('success');
            setSnackbarMessage(data.message);
            navigate('/loading')
        }
        else {
            setSnackbarType('error');
            setSnackbarMessage(data.error);
        }
        setOpenSnackbar(true);
    }).catch((error) => {
        console.error('Error adding answer: ', error);
        setSnackbarType('error');
        setSnackbarMessage('Error adding answer');
        setOpenSnackbar(true);
    });

  };

  return (
    <section className="app-div">
    <div>
      <link
        href='https://fonts.googleapis.com/css?family=Damion&display=swap'
        rel='stylesheet'
      />
      <link
        href='https://fonts.googleapis.com/css?family=Alatsi&display=swap'
        rel='stylesheet'
      />
      <h1 className="swipe-text">Swipe left for nay and right for yay</h1>
      <div className='cardContainer'>
        {db.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className='swipe'
            key={character.name}
            onSwipe={(dir) => swiped(dir, character.name, index)}
            onCardLeftScreen={() => outOfFrame(character.name, index)}
          >
            <div
              style={{ backgroundImage: 'url(' + character.url + ')' }}
              className='card'
            >
              <h3>{character.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className='buttons'>
        <button style={{ backgroundColor: !canSwipe && '#c3c4d3', color: canSwipe ? '#ffffff' : '#000000' }} onClick={() => swipe('left')}>Swipe left!</button>
        <button style={{ backgroundColor: !canGoBack && '#c3c4d3', color: canGoBack ? '#ffffff' : '#000000' }} onClick={() => goBack()}>Undo swipe!</button>
        <button style={{ backgroundColor: !canSwipe && '#c3c4d3', color: canSwipe ? '#ffffff' : '#000000' }} onClick={() => swipe('right')}>Swipe right!</button>
      </div>

      {/* Conditionally render the submit container based on swipe count */}
      <div className='submitContainer' style={{ display: swipeCount >= 15 ? 'block' : 'none' }}>
        <button className='submitButton' onClick={handleSubmit} disabled={!showSubmitButton}>Submit</button>
      </div>

      {lastDirection ? (
        <h2 key={lastDirection} className='infoText'>
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className='infoText'>
          Swipe a card or press a button to get Restore Card button visible!
        </h2>
      )}
    </div>
    </section>
  )
}

export default FlashCards
