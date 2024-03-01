const AddBlog = ({ addBlog, newBlog, handleBlogChange, user }) => {
  if (user !== null) {
    return (<><h2>Create New</h2>
      <form onSubmit={addBlog}>
        <div>
          Title:
          <input
            type="text"
            value={newBlog.title}
            name="title"
            onChange={handleBlogChange}
          />
        </div>
        <div>
          URL:
          <input
            type="text"
            value={newBlog.url}
            name="url"
            onChange={handleBlogChange}
          />
        </div>
        <button type="submit">Create</button>
      </form></>)
  }
  return <></>
}
export default AddBlog