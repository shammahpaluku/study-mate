import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, HStack, Button, Input, Textarea, 
         Icon, useToast, Modal, ModalOverlay, ModalContent, 
         ModalHeader, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import { FiPlay, FiPause, FiSquare, FiSave } from 'react-icons/fi';

interface StudySessionProps {
  onStartSession: (sessionData: { subject: string; notes: string; duration: number }) => void;
}

const StudySession: React.FC<StudySessionProps> = ({ onStartSession }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!subject.trim()) {
      toast({
        title: "Subject required",
        description: "Please enter a subject for your study session",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    if (seconds > 0) {
      onOpen();
    } else {
      handleReset();
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
    setSubject('');
    setNotes('');
  };

  const handleSaveSession = () => {
    onStartSession({
      subject: subject.trim(),
      notes: notes.trim(),
      duration: seconds
    });
    onClose();
    handleReset();
    toast({
      title: "Session saved!",
      description: `Study session for ${subject} has been recorded`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <>
      <Box 
        p={6} 
        borderWidth={1} 
        borderRadius="lg" 
        borderColor="gray.200"
        bg="white"
        boxShadow="sm"
      >
        <VStack spacing={4}>
          <Text fontSize="xl" fontWeight="600" color="gray.800">
            Study Session
          </Text>

          <VStack spacing={3} align="center" py={4}>
            <Text fontSize="4xl" fontWeight="bold" color="blue.600" fontFamily="mono">
              {formatTime(seconds)}
            </Text>
            
            <Input
              placeholder="What are you studying?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              size="md"
              maxWidth="300px"
              textAlign="center"
            />
          </VStack>

          <HStack spacing={3}>
            {!isRunning ? (
              <Button 
                leftIcon={<FiPlay />}
                colorScheme="green"
                onClick={handleStart}
                disabled={seconds > 0 && subject === ''}
              >
                Start
              </Button>
            ) : (
              <Button 
                leftIcon={<FiPause />}
                colorScheme="yellow"
                onClick={handlePause}
              >
                Pause
              </Button>
            )}
            
            <Button 
              leftIcon={<FiSquare />}
              colorScheme="red"
              onClick={handleStop}
              disabled={seconds === 0}
            >
              Stop
            </Button>
          </HStack>
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Save Study Session</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Box w="100%">
                <Text fontWeight="600" mb={2}>Subject:</Text>
                <Text color="gray.700">{subject}</Text>
              </Box>
              
              <Box w="100%">
                <Text fontWeight="600" mb={2}>Duration:</Text>
                <Text color="gray.700">{formatTime(seconds)}</Text>
              </Box>
              
              <Box w="100%">
                <Text fontWeight="600" mb={2}>Notes (optional):</Text>
                <Textarea
                  placeholder="Add notes about what you learned..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </Box>
              
              <HStack spacing={3} w="100%">
                <Button onClick={onClose} variant="outline" flex={1}>
                  Cancel
                </Button>
                <Button 
                  leftIcon={<FiSave />}
                  colorScheme="blue" 
                  onClick={handleSaveSession}
                  flex={1}
                >
                  Save Session
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default StudySession;
