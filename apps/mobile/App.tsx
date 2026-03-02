import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert
} from 'react-native';

// DVIR (Driver Vehicle Inspection Report) categories
const inspectionItems = [
  { category: 'Brakes', items: ['Air Compressor', 'Air Lines', 'Brake Accessories', 'Brake Connections', 'Brake Drums', 'Parking Brake'] },
  { category: 'Cab', items: ['Body', 'Door Latches', 'Mirrors', 'Windshield Wipers', 'Windows'] },
  { category: 'Engine', items: ['Cooling System', 'Engine', 'Oil Level', 'Exhaust System'] },
  { category: 'Fuel System', items: ['Fuel Tank', 'Fuel Cap', 'Fuel Lines'] },
  { category: 'Lights', items: ['Headlights', 'Tail Lights', 'Turn Signals', 'Clearance Lights', 'Reflectors'] },
  { category: 'Tires', items: ['Steer Tires', 'Drive Tires', 'Spare Tire', 'Wheel Lug Nuts'] },
  { category: 'Other', items: ['Horn', 'Starter', 'Transmission', 'Fifth Wheel', 'Coupling Devices'] },
];

type DefectStatus = 'ok' | 'defect' | 'unchecked';

interface InspectionState {
  [key: string]: DefectStatus;
}

export default function App() {
  const [vehicleUnit, setVehicleUnit] = useState('');
  const [odometer, setOdometer] = useState('');
  const [inspectionState, setInspectionState] = useState<InspectionState>({});
  const [defectNotes, setDefectNotes] = useState('');
  const [isPreTrip, setIsPreTrip] = useState(true);

  const toggleItem = (item: string) => {
    setInspectionState(prev => {
      const current = prev[item] || 'unchecked';
      const next: DefectStatus = current === 'unchecked' ? 'ok' : current === 'ok' ? 'defect' : 'unchecked';
      return { ...prev, [item]: next };
    });
  };

  const getItemStatus = (item: string): DefectStatus => {
    return inspectionState[item] || 'unchecked';
  };

  const getStatusColor = (status: DefectStatus) => {
    switch (status) {
      case 'ok': return '#22c55e';
      case 'defect': return '#ef4444';
      default: return '#9ca3af';
    }
  };

  const getCompletionPercentage = () => {
    const allItems = inspectionItems.flatMap(c => c.items);
    const checked = allItems.filter(item => getItemStatus(item) !== 'unchecked').length;
    return Math.round((checked / allItems.length) * 100);
  };

  const hasDefects = () => {
    return Object.values(inspectionState).some(s => s === 'defect');
  };

  const submitInspection = () => {
    if (!vehicleUnit) {
      Alert.alert('Error', 'Please enter vehicle unit number');
      return;
    }

    const completion = getCompletionPercentage();
    if (completion < 100) {
      Alert.alert('Incomplete', 'Please complete all inspection items before submitting.');
      return;
    }

    const status = hasDefects() ? 'with defects' : 'no defects found';
    Alert.alert(
      'DVIR Submitted',
      `${isPreTrip ? 'Pre-trip' : 'Post-trip'} inspection for Unit ${vehicleUnit} has been recorded (${status}).`,
      [{ text: 'OK', onPress: () => resetForm() }]
    );
  };

  const resetForm = () => {
    setVehicleUnit('');
    setOdometer('');
    setInspectionState({});
    setDefectNotes('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DOT Helper</Text>
        <Text style={styles.headerSubtitle}>Driver Vehicle Inspection</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trip Type Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, isPreTrip && styles.toggleActive]}
            onPress={() => setIsPreTrip(true)}
          >
            <Text style={[styles.toggleText, isPreTrip && styles.toggleTextActive]}>Pre-Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, !isPreTrip && styles.toggleActive]}
            onPress={() => setIsPreTrip(false)}
          >
            <Text style={[styles.toggleText, !isPreTrip && styles.toggleTextActive]}>Post-Trip</Text>
          </TouchableOpacity>
        </View>

        {/* Vehicle Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Vehicle Information</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Unit Number</Text>
              <TextInput
                style={styles.input}
                value={vehicleUnit}
                onChangeText={setVehicleUnit}
                placeholder="e.g. 101"
                placeholderTextColor="#9ca3af"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Odometer</Text>
              <TextInput
                style={styles.input}
                value={odometer}
                onChangeText={setOdometer}
                placeholder="Current miles"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Inspection Progress: {getCompletionPercentage()}%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${getCompletionPercentage()}%` }]} />
          </View>
        </View>

        {/* Inspection Categories */}
        {inspectionItems.map(category => (
          <View key={category.category} style={styles.card}>
            <Text style={styles.cardTitle}>{category.category}</Text>
            <View style={styles.itemGrid}>
              {category.items.map(item => {
                const status = getItemStatus(item);
                return (
                  <TouchableOpacity
                    key={item}
                    style={[styles.inspectionItem, { borderColor: getStatusColor(status) }]}
                    onPress={() => toggleItem(item)}
                  >
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
                    <Text style={styles.itemText}>{item}</Text>
                    <Text style={styles.statusText}>
                      {status === 'ok' ? '✓' : status === 'defect' ? '✗' : '○'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Defect Notes */}
        {hasDefects() && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Defect Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={defectNotes}
              onChangeText={setDefectNotes}
              placeholder="Describe the defects found..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
            />
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={submitInspection}>
          <Text style={styles.submitButtonText}>Submit Inspection Report</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleActive: {
    backgroundColor: '#2563eb',
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#94a3b8',
  },
  toggleTextActive: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 4,
  },
  itemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  inspectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    minWidth: '48%',
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  itemText: {
    flex: 1,
    fontSize: 13,
    color: '#e2e8f0',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
