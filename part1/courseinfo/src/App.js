// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

const App = () => {
  // const course = 'Half Stack application development'
  // const part1 = 'Fundamentals of React'
  // const exercises1 = 10
  // const part2 = 'Using props to pass data'
  // const exercises2 = 7
  // const part3 = 'State of a component'
  // const exercises3 = 14

  // const part1 = {
  //   name: 'Fundamentals of React',
  //   exercises: 10
  // }
  // const part2 = {
  //   name: 'Using props to pass data',
  //   exercises: 7
  // }
  // const part3 = {
  //   name: 'State of a component',
  //   exercises: 14
  // }

  // const parts = [
  //   {
  //     name: 'Fundamentals of React',
  //     exercises: 10
  //   },
  //   {
  //     name: 'Using props to pass data',
  //     exercises: 7
  //   },
  //   {
  //     name: 'State of a component',
  //     exercises: 14
  //   }
  // ]


  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }


  return (
    // <div>
    //   <h1>{course}</h1>
    //   <p>
    //     {part1} {exercises1}
    //   </p>
    //   <p>
    //     {part2} {exercises2}
    //   </p>
    //   <p>
    //     {part3} {exercises3}
    //   </p>
    //   <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
    // </div>

    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>

  )
}

export default App

const Header = function ({ name }) {
  // console.log(props)
  return (
    <div>
      {name}
    </div>
  )
}

const Content = function ({ parts }) {
  return (
    <div>
      <Part part={parts[0]} />
      <Part part={parts[1]} />
      <Part part={parts[2]} />
    </div>
  )
}

const Part = function ({ part }) {
  return (
    <div>
      Part <b>{part.name}</b> , Exercises count:<b>{part.exercises}</b>
    </div>
  )
}


const Total = function ({ parts }) {
  return (
    <div>
      Number of exercises: <b>{parts[0].exercises + parts[1].exercises + parts[2].exercises}</b>
    </div>
  )
}