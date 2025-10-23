export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <span className="ml-3 text-gray-600">Loading news...</span>
    </div>
  )
}