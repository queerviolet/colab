window.addEventListener('click', event => {
  const {target} = event
  if (!target) return
  if (target.matches('.nonempty.input_prompt') || target.matches('.crease')) {
    const cell = target.closest('.cell')
    if (!cell) return
    cell.classList.toggle('folded')
    cell.querySelector('.crease')?.scrollIntoViewIfNeeded({ behavior: 'smooth' })
  }
})