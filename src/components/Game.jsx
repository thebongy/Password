import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
} from 'react-bootstrap';
import propTypes from 'prop-types';

import Heading from './Heading';
import Chat from './Chat';
import PlayerList from './PlayerList';
import GameCard from './GameCard';
import API from '../API';

import '../assets/css/Game.css';

function Game(props) {
  const {
    username,
    roomId,
    players,
    hints,
    previousPassword,
    currentPassword,
    passwordLength,
    currentRound,
    passwordHolder,
    sendMessage,
    sendHint,
    messageList,
    fetchData,
  } = props;

  const [hint, setHint] = useState('');

  useEffect(() => {
    const fetch = async () => { await fetchData(); };
    fetch();
  }, [fetchData]);

  console.log(hints, previousPassword);
  const handleChange = ({ target }) => setHint(target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = (await API.post('/game/hint', {
      username,
      roomId,
      hint,
    })).data;

    if (!response.success) {
      console.error(response.message);
      return;
    }

    sendHint(response.message.hints, roomId, username);
    setHint('');
  };

  const renderBlanks = () => {
    if (currentPassword) {
      return (
        <div className="current-password">
          {currentPassword}
        </div>
      );
    }
    const blanks = new Array(passwordLength).fill(
      '_ ',
    );
    return blanks.map((blank) => blank);
  };

  const renderPreiviousHints = () => (hints.map((h, index) => (
    <div key={Math.random().toString()}>
      Hint
      {' '}
      {index + 1}
      :
      {' '}
      {h}
    </div>
  ))
  );

  return (
    <Container fluid className="game-container">
      <Heading />
      <Row className="mt-4">
        <Col md>
          <PlayerList
            header={`Round ${currentRound}`}
            players={players}
          />
        </Col>
        <Col md className="mb-4 d-flex flex-column justify-content-center">
          <GameCard>
            <GameCard.Body className="text-center password-card">
              <div>The Password is:</div>
              <div className="blanks">{renderBlanks()}</div>
            </GameCard.Body>
          </GameCard>
          <GameCard className="mt-2">
            <GameCard.Body className="d-flex flex-column justify-content-between hint-card">
              <div className="hints">
                <div className="text-center">
                  <div className="hint-pretext">The current hint is:</div>
                  <div className="current-hint mb-2">{hints.slice(-1)[0]}</div>
                </div>
                <div className="prev-hint-container">
                  {renderPreiviousHints()}
                </div>
              </div>
              <Form onSubmit={handleSubmit} className="send-hint">
                <Row>
                  <Col>
                    <Form.Control
                      type="text"
                      disabled={username !== passwordHolder}
                      placeholder="Type the hint here!"
                      value={hint}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col xs="auto">
                    <Button type="submit" variant="success">Send</Button>
                  </Col>
                </Row>
              </Form>
            </GameCard.Body>
          </GameCard>
        </Col>
        <Col className="game-chat">
          <Chat
            sendMessage={sendMessage}
            messageList={messageList}
          />
        </Col>
      </Row>
    </Container>
  );
}

Game.propTypes = {
  username: propTypes.string.isRequired,
  roomId: propTypes.string.isRequired,
  hints: propTypes.arrayOf(propTypes.string).isRequired,
  previousPassword: propTypes.string.isRequired,
  currentPassword: propTypes.string.isRequired,
  passwordLength: propTypes.number.isRequired,
  currentRound: propTypes.number.isRequired,
  passwordHolder: propTypes.string.isRequired,
  sendHint: propTypes.func.isRequired,
  sendMessage: propTypes.func.isRequired,
  fetchData: propTypes.func.isRequired,
  messageList: propTypes.arrayOf(propTypes.shape({
    message: propTypes.string,
    username: propTypes.string,
    time: propTypes.string,
  })).isRequired,
  players: propTypes.arrayOf(propTypes.shape({
    username: propTypes.string,
    points: propTypes.number,
    _id: propTypes.string,
  })).isRequired,
};

export default Game;
