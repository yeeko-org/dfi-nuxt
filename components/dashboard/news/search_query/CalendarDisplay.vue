<script setup>

import dayjs from 'dayjs'
// add isBetween plugin
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

const props = defineProps({
  apply_queries: Array,
})

// const recent_months_with_day_js = ref(null)
const is_ready = ref(false)

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
  "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

// function daysInMonth(month, year) {
//   return new Date(year, month, 0).getDate();
// }

const all_limits = computed(() => {
  return props.apply_queries.reduce((acc, apply_query) => {
    // acc.push({'date': apply_query.from_date, 'type': 'from'}
    // acc.push({'date': apply_query.to_date, 'type': 'to'})
    acc[apply_query.from_date] = 'from'
    acc[apply_query.to_date] = 'to'
    return acc
  }, {})
})

function getLimits() {
  if (!props.apply_queries)
    return {}
  return props.apply_queries.reduce((acc, apply_query) => {
    acc[apply_query.from_date] = 'from'
    acc[apply_query.to_date] = 'to'
    return acc
  }, {})
}

function getLimitsWithDayJS() {
  if (!props.apply_queries)
    return {}
  return props.apply_queries.map(apply_query => {
    return {
      from_date: dayjs(apply_query.from_date),
      to_date: dayjs(apply_query.to_date),
    }
  })
}

// const recent_months = computed(() => {
//   const now = new Date()
//   const current_month = now.getMonth()
//   const current_year = now.getFullYear()
//   // const today = now.getDay() + 1
//   let all_days = {}
//   // const all_limits = getLimits()
//   for (let i = 0; i < 4; i++){
//     const months_offset = current_month - i
//     const year = months_offset < 0 ? current_year - 1 : current_year
//     const month = (months_offset + 12) % 12
//     const current_days = daysInMonth(month, year)
//     const base_days = month === current_month ? today : current_days
//     let days = Array.from({length: base_days}, (_, i) => i + 1)
//     days = days.map(day => {
//       const real_month = month + 1
//       const str_month = real_month > 10 ? real_month : `0${real_month}`
//       const str_day = day > 10 ? day : `0${day}`
//       const full_day = `${year}-${str_month}-${str_day}`
//       // const limit = all_limits[full_day]
//       let day_obj = {
//         number: day, month: real_month, year, full_day}
//       // if (limit)
//       //   day_obj.limit = limit
//       // day_obj.limit = Math.random() > 0.8
//       return day_obj
//     })
//     all_days[month] = days
//   }
//   // console.log("all_days", all_days)
//   return Object.entries(all_days).map(([month, days]) => {
//     return {"month": months[month - 1], "days": days}
//   })
// })

const recent_months_with_day_js = computed(() => {
  if (is_ready.value)
    return
  const now = dayjs()
  const three_months_ago = now.subtract(3, 'month')
  let current_day = three_months_ago.startOf('month')
  current_day = current_day.subtract(1, 'day')
  let all_days = {}
  const limits = getLimits()
  const between_dates = getLimitsWithDayJS()
  while (current_day.isBefore(now)){
    current_day = current_day.add(1, 'day')
    const year_month = current_day.format('YYYY-MM')
    const date_str = current_day.format('YYYY-MM-DD')
    const limit = limits[date_str]
    const is_between = between_dates.some(date => {
      return current_day.isBetween(date.from_date, date.to_date, null, '[]')
    })

    const day_obj = {
      number: current_day.date(),
      month: current_day.month() + 1,
      year: current_day.year(),
      full_day: date_str,
      limit: limit,
      is_between: limit || is_between
    }
    if (all_days[year_month])
      all_days[year_month].push(day_obj)
    else
      all_days[year_month] = [day_obj]
  }
  console.log("all_days", all_days)
  return Object.entries(all_days).map(([month, days]) => {
    const month_str = dayjs(month).format('MMMM')
    return {"month": month_str, "days": days}
  })



})

// watch(
//   props.apply_queries, () => {
//     if (is_ready.value)
//       return
//     is_ready.value = true
//     console.log("props.apply_queries", props.apply_queries)
//     // recent_months_with_day_js.value = calculateRecentMonths()
//   },
//   {deep: true}
// )
</script>

<template>
  <v-card
    class="pa-2"
    color="grey-lighten-4"
    style="width: 100%;"
  >
    <div
      v-for="month in recent_months_with_day_js"
      :key="month.month"
      class="d-flex align-center"
    >
      <div
        class="text-subtitle-1 mr-3 text-left"
        style="width: 100px;"
      >
        {{month.month}}
      </div>
      <div
        v-for="day in month.days"
        :key="day.full_day"
      >
        <v-badge
          v-if="day.limit"
          color="transparent"
          variant="text"
          :location="day.limit === 'from' ? 'top left' : 'top right'"
        >
          <template v-slot:badge>
            <v-icon
              color="purple"
              v-if="day.limit === 'from'"
            >
              arrow_forward_ios
            </v-icon>
            <v-icon
              v-else
              color="purple"
              variant="text"
              _class="turn180"
            >
              arrow_back_ios
            </v-icon>
          </template>
          <v-avatar
            :color="day.is_between ? 'cyan' : 'cyan-lighten-4'"
            size="x-small"
            class="mr-1 text-caption text-grey-darken-3"
          >
            {{day.number}}
          </v-avatar>
        </v-badge>
        <v-avatar
          v-else
          :color="day.is_between ? 'cyan' : 'cyan-lighten-4'"
          size="x-small"
          class="mr-1 text-caption text-grey-darken-2"
        >
          {{day.number}}
        </v-avatar>
      </div>
    </div>
  </v-card>

</template>

<style scoped>
.turn180 {
  transform: rotate(180deg);
}
</style>