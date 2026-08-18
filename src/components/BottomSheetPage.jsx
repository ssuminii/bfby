export default function BottomSheetPage({ header, title, children }) {
  return (
    <div className='flex flex-col h-full'>
      <div className='h-[33%] min-h-[180px] shrink-0 flex flex-col bg-white'>
        {header}
        <div className='flex-1 flex flex-col items-center justify-end gap-2.5 text-center px-6 pb-[54px]'>
          {title}
        </div>
      </div>
      <div className='flex-1 min-h-0 flex flex-col bg-gray-50 rounded-tl-[50px] rounded-tr-[50px] drop-shadow-[0_0_3px_rgba(0,0,0,0.12)] px-6 pt-6 pb-10'>
        {children}
      </div>
    </div>
  )
}
