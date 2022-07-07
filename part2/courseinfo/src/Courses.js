

const Part = ({ part }) =>
    <li >
        {part.name} {part.exercises}
    </li>

const Header = ({ course }) => <h2>{course.name}</h2>
const Content = ({ parts }) => {

    return (
        <ul>
            {parts.map(part => <Part key={part.id} part={part} />)}
        </ul>
    )
}
const Total = ({ sum }) => <p><b>Number of {sum} exercises </b></p>


const Course = ({ course }) => {
    const sum = course.parts.reduce((acc, part) => part.exercises + acc
        , 0)
    return (
        <div>
            <Header course={course} />
            <Content parts={course.parts} />
            <Total sum={sum} />
        </div>
    )
}

export const Courses = ({ courses }) => {
    return courses.map(course => <Course key={course.id} course={course} />)
}