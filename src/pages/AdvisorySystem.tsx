import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CardContent,
  CardActions,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Card,
} from '@mui/material';
import {
  Send,
  Psychology,
  Agriculture,
  Science,
  QuestionAnswer,
  CheckCircle,
  Info,
  Warning,
} from '@mui/icons-material';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AdvisoryCategory {
  title: string;
  description: string;
  icon: React.ReactNode;
  topics: string[];
}

const AdvisorySystem: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI farming advisor. I can help you with cassava disease management, best practices, and farming techniques. What would you like to know?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const advisoryCategories: AdvisoryCategory[] = [
    {
      title: 'Disease Management',
      description: 'Learn about preventing and treating common cassava diseases',
      icon: <Warning sx={{ fontSize: 40, color: 'error.main' }} />,
      topics: [
        'Cassava Mosaic Disease prevention',
        'Brown Streak Disease control',
        'Bacterial Blight treatment',
        'Integrated pest management',
        'Disease-resistant varieties'
      ]
    },
    {
      title: 'Best Practices',
      description: 'Essential farming techniques for optimal cassava production',
      icon: <Agriculture sx={{ fontSize: 40, color: 'primary.main' }} />,
      topics: [
        'Soil preparation and fertility',
        'Planting techniques and spacing',
        'Water management',
        'Harvesting and post-harvest',
        'Crop rotation strategies'
      ]
    },
    {
      title: 'Variety Selection',
      description: 'Choose the right cassava varieties for your conditions',
      icon: <Science sx={{ fontSize: 40, color: 'secondary.main' }} />,
      topics: [
        'High-yielding varieties',
        'Disease-resistant cultivars',
        'Climate-adapted varieties',
        'Local variety recommendations',
        'Seed quality assessment'
      ]
    }
  ];

  // Mock responses for demonstration
  const mockResponses = [
    "Based on your question about cassava diseases, I recommend implementing regular field monitoring and using certified disease-free planting material. Early detection is crucial for effective management.",
    "For soil fertility, consider incorporating organic matter and practicing crop rotation. Cassava responds well to balanced fertilization, especially with potassium and phosphorus.",
    "When selecting cassava varieties, look for those resistant to common diseases in your area. Local agricultural extension services can provide specific recommendations for your region.",
    "Water management is critical for cassava. While cassava is drought-tolerant, consistent moisture during the first 3-4 months after planting is essential for good root development.",
    "For pest control, consider integrated pest management approaches. This includes cultural practices, biological control, and minimal use of chemical pesticides when necessary."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (topic: string) => {
    setInputText(topic);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        AI Farming Advisory System
      </Typography>
      
      <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, maxWidth: 800, mx: 'auto' }}>
        Get personalized advice on cassava farming, disease management, and best practices. 
        Ask me anything about cassava cultivation!
      </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
          {/* Chat Interface */}
          <Paper elevation={3} sx={{ p: 3, height: 600, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Psychology sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
              <Typography variant="h5">
                Chat with AI Advisor
              </Typography>
            </Box>

            {/* Messages Area */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      backgroundColor: message.isUser ? 'primary.main' : 'white',
                      color: message.isUser ? 'white' : 'text.primary',
                      p: 2,
                      borderRadius: 2,
                      boxShadow: 1,
                    }}
                  >
                    <Typography variant="body1">{message.text}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7, mt: 1, display: 'block' }}>
                      {message.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
              
              {isTyping && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                  <Box sx={{ backgroundColor: 'white', p: 2, borderRadius: 2, boxShadow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      <Typography variant="body2">AI is typing...</Typography>
                    </Box>
                  </Box>
                </Box>
              )}
              
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about cassava farming, diseases, or best practices..."
                variant="outlined"
                size="small"
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                sx={{ minWidth: 100 }}
              >
                <Send />
              </Button>
            </Box>
          </Paper>

          {/* Quick Topics & Categories */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Quick Questions
            </Typography>
            <List dense>
              {[
                'How to prevent cassava mosaic disease?',
                'Best soil preparation for cassava?',
                'When to harvest cassava?',
                'How to control pests naturally?',
                'Which varieties are disease-resistant?'
              ].map((question, index) => (
                <ListItem key={index} onClick={() => handleQuickQuestion(question)} sx={{ cursor: 'pointer' }}>
                  <ListItemIcon>
                    <QuestionAnswer sx={{ fontSize: 20, color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={question} 
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Advisory Categories */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Advisory Categories
            </Typography>
            {advisoryCategories.map((category, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent sx={{ pb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {category.icon}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {category.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {category.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {category.topics.slice(0, 3).map((topic, topicIndex) => (
                      <Chip
                        key={topicIndex}
                        label={topic}
                        size="small"
                        variant="outlined"
                        onClick={() => handleQuickQuestion(topic)}
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => handleQuickQuestion(`Tell me more about ${category.title.toLowerCase()}`)}
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Paper>
        </Box>

      {/* Tips Section */}
      <Paper elevation={2} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
          Getting the Most from Your AI Advisor
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Info sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>Be Specific</Typography>
            <Typography variant="body2" color="text.secondary">
              Ask detailed questions about your specific situation for better advice
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Agriculture sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>Local Context</Typography>
            <Typography variant="body2" color="text.secondary">
              Mention your location and climate for region-specific recommendations
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>Follow Up</Typography>
            <Typography variant="body2" color="text.secondary">
              Ask follow-up questions to clarify and get more detailed information
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Science sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>Best Practices</Typography>
            <Typography variant="body2" color="text.secondary">
              Request step-by-step guidance for implementing recommendations
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdvisorySystem;
