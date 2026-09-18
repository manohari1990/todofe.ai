function ModalUI({ isOpen, setIsOpen, children, modalTitle='PopUp', submitText = 'Submit', onSubmit }) {

    return (
        <>
            <div 
                id="default-modal" 
                tabIndex="-1" 
                className={`${isOpen ? '' : 'hidden'} flex overflow-y-auto overflow-x-hidden fixed z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-slate-500/50`}
            >
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                    <div className="relative shadow-sm p-4 md:p-6 bg-white rounded-2xl">
                        <div className="flex items-center justify-between pb-4 md:pb-5">
                            <h3 className="text-lg font-medium text-heading">
                                {modalTitle}
                            </h3>
                            
                            <button 
                                type="button" 
                                className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center" 
                                data-modal-hide="default-modal" 
                                onClick={() => setIsOpen(false)}
                            >
                                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" /></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <hr className="my-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"></hr>
                        <div className="my-5 space-y-4 md:space-y-6 py-4 md:py-6">
                            {children}
                        </div>
                        <hr className="my-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"></hr>
                        <div className="flex justify-center space-x-4 pt-4 md:pt-5">
                            <button 
                                data-modal-hide="default-modal" 
                                type="button" 
                                onClick={onSubmit}
                                className="py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                                {submitText}
                            </button>

                            <button 
                                data-modal-hide="default-modal"
                                type="button" 
                                onClick={() => setIsOpen(false)}
                                className="py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-gray-600 bg-gray-600 hover:bg-gray-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default ModalUI