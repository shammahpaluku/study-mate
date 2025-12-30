import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Text, Heading, Button, useColorModeValue, Icon } from '@chakra-ui/react';
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface CalendarDay {
  date: number;
  month: number;
  year: number;
  hasActivity: boolean;
  studyMinutes: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

const StudyCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Get study activities
    const studyActivities = localStorage.getItem('studyActivities');
    const activities = studyActivities ? JSON.parse(studyActivities) : [];
    
    // Create activity map
    const activityMap: { [key: string]: number } = {};
    activities.forEach((activity: any) => {
      const activityDate = new Date(activity.timestamp);
      if (activityDate.getFullYear() === year && activityDate.getMonth() === month) {
        const dayKey = activityDate.getDate();
        if (!activityMap[dayKey]) {
          activityMap[dayKey] = 0;
        }
        activityMap[dayKey] += activity.duration;
      }
    });
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    // Add previous month's trailing days
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthDays - i,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
        hasActivity: false,
        studyMinutes: 0,
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
      const studyMinutes = activityMap[day] || 0;
      
      days.push({
        date: day,
        month,
        year,
        hasActivity: studyMinutes > 0,
        studyMinutes,
        isCurrentMonth: true,
        isToday
      });
    }
    
    // Add next month's leading days
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: day,
        month: month + 1,
        year: month === 11 ? year + 1 : year,
        hasActivity: false,
        studyMinutes: 0,
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    setCalendarDays(days);
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDayColor = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return 'gray.300';
    if (day.isToday) return 'blue.500';
    if (day.hasActivity) return 'green.500';
    return 'gray.700';
  };

  const getDayBg = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return 'transparent';
    if (day.isToday) return 'blue.100';
    if (day.hasActivity) return 'green.100';
    return 'transparent';
  };

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Box p={6} borderWidth={1} borderRadius="lg" borderColor={borderColor} bg={cardBg} boxShadow="sm">
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between" align="center">
          <HStack spacing={3}>
            <Icon as={FiCalendar} boxSize={5} color="blue.500" />
            <Heading as="h3" size="md" color="gray.900">
              Study Calendar
            </Heading>
          </HStack>
          <HStack spacing={2}>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigateMonth(-1)}
              _hover={{ bg: 'gray.100' }}
            >
              <FiChevronLeft />
            </Button>
            <Text fontSize="md" fontWeight="600" color="gray.800" minW="120px" textAlign="center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigateMonth(1)}
              _hover={{ bg: 'gray.100' }}
            >
              <FiChevronRight />
            </Button>
          </HStack>
        </HStack>

        {/* Calendar Grid */}
        <VStack spacing={2} align="stretch">
          {/* Week day headers */}
          <HStack spacing={2}>
            {weekDays.map(day => (
              <Text key={day} fontSize="xs" fontWeight="600" color="gray.600" flex={1} textAlign="center">
                {day}
              </Text>
            ))}
          </HStack>

          {/* Calendar days */}
          <VStack spacing={1}>
            {Array.from({ length: 6 }, (_, weekIndex) => (
              <HStack key={weekIndex} spacing={2}>
                {calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => (
                  <Box
                    key={`${weekIndex}-${dayIndex}`}
                    flex={1}
                    aspectRatio={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="md"
                    borderWidth={day.isToday ? 2 : 1}
                    borderColor={day.isToday ? 'blue.500' : 'gray.200'}
                    bg={getDayBg(day)}
                    cursor={day.isCurrentMonth ? 'pointer' : 'default'}
                    transition="all 0.2s ease-in-out"
                    _hover={day.isCurrentMonth ? {
                      transform: 'scale(1.05)',
                      boxShadow: 'sm'
                    } : {}}
                    position="relative"
                  >
                    <VStack spacing={0} align="center">
                      <Text
                        fontSize="sm"
                        fontWeight={day.isToday ? '700' : '500'}
                        color={getDayColor(day)}
                      >
                        {day.date}
                      </Text>
                      {day.hasActivity && (
                        <Box
                          w={1}
                          h={1}
                          borderRadius="full"
                          bg="green.500"
                        />
                      )}
                    </VStack>
                    {day.hasActivity && (
                      <Box
                        position="absolute"
                        top={1}
                        right={1}
                        w={2}
                        h={2}
                        borderRadius="full"
                        bg="green.500"
                      />
                    )}
                  </Box>
                ))}
              </HStack>
            ))}
          </VStack>
        </VStack>

        {/* Legend */}
        <HStack spacing={4} justify="center" pt={2}>
          <HStack spacing={2}>
            <Box w={3} h={3} borderRadius="full" bg="green.500" />
            <Text fontSize="xs" color="gray.600">Study Day</Text>
          </HStack>
          <HStack spacing={2}>
            <Box w={3} h={3} borderRadius="full" bg="blue.500" />
            <Text fontSize="xs" color="gray.600">Today</Text>
          </HStack>
          <HStack spacing={2}>
            <Box w={3} h={3} borderRadius="full" bg="gray.300" />
            <Text fontSize="xs" color="gray.600">Other Month</Text>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export default StudyCalendar;
