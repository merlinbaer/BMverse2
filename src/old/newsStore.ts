/*
  // Computed observable for a sorted array
  const news$ = computed(() => {
    const data = data$.get()
    if (!data) return []

    return Object.values(data)
      .sort((a, b) => {
        const dateA = a.news_update ? new Date(a.news_update).getTime() : 0
        const dateB = b.news_update ? new Date(b.news_update).getTime() : 0
        return dateB - dateA
      })
      .map(item => ({
        ...item,
        displayDate: item.news_update
          ? new Date(item.news_update).toLocaleDateString([], {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            })
          : '',
      }))
  })
  attachSyncLogger(data$, tableName)
  */
