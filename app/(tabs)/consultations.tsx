import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface Consultation {
  id: string;
  dentist_id: string;
  appointment_date: string;
  status: string;
  consultation_type: string;
  notes: string | null;
  dentists: {
    full_name: string;
    specialization: string;
    rating: number;
    image_url: string | null;
  };
}

export default function ConsultationsScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchConsultations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('consultations')
        .select(`
          *,
          dentists (
            full_name,
            specialization,
            rating,
            image_url
          )
        `)
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      setConsultations(data || []);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to fetch consultations');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchConsultations();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'completed':
        return '#3b82f6';
      case 'cancelled':
        return '#ef4444';
      default:
        return isDark ? '#8e8e93' : '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const styles = {
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#f8fafc',
    },
    header: {
      padding: 20,
      backgroundColor: isDark ? '#000000' : '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#1f1f1f' : '#e5e7eb',
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold' as const,
      color: isDark ? '#ffffff' : '#000000',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 16,
      color: isDark ? '#8e8e93' : '#6b7280',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      paddingHorizontal: 32,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '600' as const,
      color: isDark ? '#ffffff' : '#000000',
      marginBottom: 8,
      textAlign: 'center' as const,
    },
    emptyText: {
      fontSize: 16,
      color: isDark ? '#8e8e93' : '#6b7280',
      textAlign: 'center' as const,
      lineHeight: 24,
      marginBottom: 24,
    },
    bookButton: {
      backgroundColor: '#FF0000',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
    },
    bookButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600' as const,
    },
    consultationCard: {
      backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? '#2c2c2e' : '#e5e7eb',
    },
    cardHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'flex-start' as const,
      marginBottom: 12,
    },
    dentistInfo: {
      flex: 1,
    },
    dentistName: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: isDark ? '#ffffff' : '#000000',
      marginBottom: 4,
    },
    specialization: {
      fontSize: 14,
      color: isDark ? '#8e8e93' : '#6b7280',
      marginBottom: 4,
    },
    rating: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },
    ratingText: {
      fontSize: 14,
      color: isDark ? '#8e8e93' : '#6b7280',
      marginLeft: 4,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      alignSelf: 'flex-start' as const,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600' as const,
      color: '#ffffff',
      textTransform: 'capitalize' as const,
    },
    appointmentInfo: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginBottom: 8,
    },
    appointmentText: {
      fontSize: 14,
      color: isDark ? '#ffffff' : '#000000',
      marginLeft: 8,
      fontWeight: '500' as const,
    },
    typeInfo: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginBottom: 12,
    },
    typeText: {
      fontSize: 14,
      color: isDark ? '#8e8e93' : '#6b7280',
      marginLeft: 8,
    },
    notesContainer: {
      backgroundColor: isDark ? '#2c2c2e' : '#f8fafc',
      borderRadius: 8,
      padding: 12,
      marginTop: 8,
    },
    notesText: {
      fontSize: 14,
      color: isDark ? '#ffffff' : '#000000',
      lineHeight: 20,
    },
    cardActions: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      marginTop: 12,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginHorizontal: 4,
      alignItems: 'center' as const,
    },
    primaryAction: {
      backgroundColor: '#FF0000',
    },
    secondaryAction: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: isDark ? '#2c2c2e' : '#e5e7eb',
    },
    actionText: {
      fontSize: 14,
      fontWeight: '600' as const,
    },
    primaryActionText: {
      color: '#ffffff',
    },
    secondaryActionText: {
      color: isDark ? '#ffffff' : '#000000',
    },
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Consultations</Text>
          <Text style={styles.headerSubtitle}>Manage your appointments</Text>
        </View>
        <View style={[styles.emptyContainer, { justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color="#FF0000" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Consultations</Text>
        <Text style={styles.headerSubtitle}>Manage your appointments</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {consultations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="calendar-outline"
              size={64}
              color={isDark ? '#8e8e93' : '#6b7280'}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>No Consultations Yet</Text>
            <Text style={styles.emptyText}>
              Book your first consultation with a dental professional to get personalized advice
              based on your oral health scans.
            </Text>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => Alert.alert('Coming Soon', 'Consultation booking feature will be available soon!')}
            >
              <Text style={styles.bookButtonText}>Book Consultation</Text>
            </TouchableOpacity>
          </View>
        ) : (
          consultations.map((consultation) => (
            <View key={consultation.id} style={styles.consultationCard}>
              <View style={styles.cardHeader}>
                <View style={styles.dentistInfo}>
                  <Text style={styles.dentistName}>
                    Dr. {consultation.dentists.full_name}
                  </Text>
                  <Text style={styles.specialization}>
                    {consultation.dentists.specialization}
                  </Text>
                  <View style={styles.rating}>
                    <Ionicons name="star" size={14} color="#fbbf24" />
                    <Text style={styles.ratingText}>
                      {consultation.dentists.rating.toFixed(1)}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(consultation.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{consultation.status}</Text>
                </View>
              </View>

              <View style={styles.appointmentInfo}>
                <Ionicons
                  name="calendar"
                  size={16}
                  color={isDark ? '#8e8e93' : '#6b7280'}
                />
                <Text style={styles.appointmentText}>
                  {formatDate(consultation.appointment_date)}
                </Text>
              </View>

              <View style={styles.typeInfo}>
                <Ionicons
                  name="medical"
                  size={16}
                  color={isDark ? '#8e8e93' : '#6b7280'}
                />
                <Text style={styles.typeText}>{consultation.consultation_type}</Text>
              </View>

              {consultation.notes && (
                <View style={styles.notesContainer}>
                  <Text style={styles.notesText}>{consultation.notes}</Text>
                </View>
              )}

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.secondaryAction]}
                  onPress={() => Alert.alert('Coming Soon', 'Consultation details will be available soon!')}
                >
                  <Text style={[styles.actionText, styles.secondaryActionText]}>
                    View Details
                  </Text>
                </TouchableOpacity>
                {consultation.status === 'pending' && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryAction]}
                    onPress={() => Alert.alert('Coming Soon', 'Reschedule feature will be available soon!')}
                  >
                    <Text style={[styles.actionText, styles.primaryActionText]}>
                      Reschedule
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
