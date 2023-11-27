const PageButton = ({ pageNumber, onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      className={`${
        isActive ? "bg-blue-500 text-white" : ""
      } border border-gray-300 px-2 py-1 rounded-lg mx-1`}
    >
      {pageNumber}
    </button>
  )
}

const Pagination = (props) => {
  const { totalPages, handlePageChange, currentPage } = props

  const renderPageButtons = () => {
    if (totalPages <= 1) {
      return null
    }

    const renderPageButton = (pageNumber) => {
      const isActive = currentPage === pageNumber

      return (
        <PageButton
          key={pageNumber}
          onClick={() => handlePageChange(pageNumber)}
          pageNumber={pageNumber}
          isActive={isActive}
        />
      )
    }

    let pageButtons = []

    if (totalPages <= 10) {
      pageButtons = Array.from({ length: totalPages }, (_, index) =>
        renderPageButton(index + 1)
      )
    } else {
      if (currentPage <= 5) {
        pageButtons = [
          ...Array.from({ length: 6 }, (_, index) =>
            renderPageButton(index + 1)
          ),
          <span key="ellipsis1">...</span>,
          renderPageButton(totalPages),
        ]
      } else if (currentPage > totalPages - 5) {
        pageButtons = [
          renderPageButton(1),
          <span key="ellipsis2">...</span>,
          ...Array.from({ length: 6 }, (_, index) =>
            renderPageButton(totalPages - 5 + index)
          ),
        ]
      } else {
        pageButtons = [
          renderPageButton(1),
          <span key="ellipsis3">...</span>,
          ...Array.from({ length: 5 }, (_, index) =>
            renderPageButton(currentPage - 2 + index)
          ),
          <span key="ellipsis4">...</span>,
          renderPageButton(totalPages),
        ]
      }
    }

    return pageButtons
  }

  if (!totalPages) {
    return null
  }

  return <div className="flex justify-center">{renderPageButtons()}</div>
}

export default Pagination
