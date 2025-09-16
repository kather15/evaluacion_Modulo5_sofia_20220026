import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export default function EditProfileScreen({ navigation, route }) {
  const { userData, onUpdate } = route.params || {};
  
  const [formData, setFormData] = useState({
    nombre: userData?.nombre || '',
    edad: userData?.edad?.toString() || '',
    especialidad: userData?.especialidad || '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const { nombre, edad, especialidad } = formData;

    if (!nombre || !edad || !especialidad) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (isNaN(parseInt(edad)) || parseInt(edad) <= 0) {
      Alert.alert('Error', 'Por favor ingresa una edad válida');
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          nombre: nombre.trim(),
          edad: parseInt(edad),
          especialidad: especialidad.trim(),
          updatedAt: new Date().toISOString(),
        });

        Alert.alert('Éxito', 'Información actualizada correctamente', [
          {
            text: 'OK',
            onPress: () => {
              if (onUpdate) onUpdate(); // Actualizar datos en HomeScreen
              navigation.goBack();
            },
          },
        ]);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'No se pudo actualizar la información. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backButtonText}>← Volver</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>Editar Perfil</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre completo"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={formData.nombre}
                  onChangeText={(value) => handleInputChange('nombre', value)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Correo Electrónico</Text>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value={userData?.email || auth.currentUser?.email || ''}
                  editable={false}
                />
                <Text style={styles.helperText}>
                  El correo electrónico no se puede modificar
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Edad</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Edad"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  keyboardType="numeric"
                  value={formData.edad}
                  onChangeText={(value) => handleInputChange('edad', value)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Especialidad</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Especialidad"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={formData.especialidad}
                  onChangeText={(value) => handleInputChange('especialidad', value)}
                />
              </View>

              <TouchableOpacity 
                style={[styles.saveButton, loading && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={loading}
              >
                <Text style={styles.saveButtonText}>
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 25,
    borderRadius: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    color: 'white',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  inputDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    opacity: 0.7,
  },
  helperText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});