export const data = new Array(10).fill(0).map((_, key) => ({
  title: 'Total Revenue ' + key,
  value: '$45,231.89',
  description: '+20.1% from last month',
  icon: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      className='text-muted-foreground h-4 w-4'
    >
      <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
    </svg>
  ),
}))
