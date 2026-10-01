import { useState } from 'react';

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const FeedbackButtons = ({ onGoodClick, onNeutralClick, onBadClick }) => {
  return (
    <div>
      <h2>Give Feedback</h2>
      <Button onClick={onGoodClick} text="Good" />
      <Button onClick={onNeutralClick} text="Neutral" />
      <Button onClick={onBadClick} text="Bad" />
    </div>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;

  if (total === 0) {
    return (
      <div>
        <h2>Statistics</h2>
        <p>No feedback given</p>
      </div>
    );
  }

  const average = (good - bad) / total;
  const positivePercentage = (good / total) * 100;

  return (
    <div>
      <h2>Statistics</h2>

      <table>
        <tbody>
          <StatisticLine text="Good" value={good} />
          <StatisticLine text="Neutral" value={neutral} />
          <StatisticLine text="Bad" value={bad} />
          <StatisticLine text="Total" value={total} />
          <StatisticLine text="Average" value={average} />
          <StatisticLine text="Positive" value={`${positivePercentage}%`} />
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => setGood(good + 1);
  const handleNeutralClick = () => setNeutral(neutral + 1);
  const handleBadClick = () => setBad(bad + 1);

  return (
    <>
      <FeedbackButtons onGoodClick={handleGoodClick} onNeutralClick={handleNeutralClick} onBadClick={handleBadClick} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  );
};

export default App;
