import { Column, CustomTable } from '../lib/components/table/custom-table'
import './App.css'

type Test = {
  firstName: string
  lastName: string
  age: number
}

function App() {

  const data: Test[] = [
    { firstName: 'a', lastName: 'b', age: 1 },
    { firstName: 'a', lastName: 'b', age: 1 },
    { firstName: 'a', lastName: 'b', age: 1 },
    { firstName: 'a', lastName: 'b', age: 1 },
    { firstName: 'a', lastName: 'b', age: 1 },
    { firstName: 'a', lastName: 'b', age: 1 },
    { firstName: 'a', lastName: 'b', age: 1 },
    { firstName: 'a', lastName: 'b', age: 1 },
    { firstName: 'a', lastName: 'b', age: 1 },
    { firstName: 'a', lastName: 'b', age: 1 },
  ]

  const columns: Column<Test>[] = [
    {id: 'firstName', name: 'First Name'},
    {id: 'lastName', name: 'Last Name'},
    {id: 'age', name: 'Age Name'},
  ]

  return (
    <>
    asd
      <CustomTable data={data} columns={columns}/>
    </>
  )
}

export default App
