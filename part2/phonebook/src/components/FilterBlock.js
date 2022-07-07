export const FilterBlock = ({ filterHandler, filterInput }) => {

  return (<div>filter shown with
    <input value={filterInput} onChange={filterHandler} />
  </div>)
}
