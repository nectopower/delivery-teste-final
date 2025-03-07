import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSave, FaPlus, FaTrash, FaRoute, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import api from '../services/api';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#3b82f6' : 'white'};
  color: ${props => props.primary ? 'white' : '#1e293b'};
  border: ${props => props.primary ? 'none' : '1px solid #e2e8f0'};
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: ${props => props.primary ? '#2563eb' : '#f8fafc'};
  }
  
  &:disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #64748b;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #64748b;
  font-weight: 500;
  font-size: 14px;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
  font-size: 14px;
`;

const ActionButton = styled.button`
  background-color: transparent;
  color: ${props => props.delete ? '#ef4444' : '#3b82f6'};
  border: none;
  padding: 4px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    color: ${props => props.delete ? '#dc2626' : '#2563eb'};
  }
`;

const InfoText = styled.p`
  color: #64748b;
  font-size: 14px;
  margin: 8px 0;
  font-style: italic;
`;

const DeliveryFeeConfig = () => {
  const [baseConfig, setBaseConfig] = useState({
    baseFee: 5.0,
    feePerKm: 1.5,
    minDistance: 1.0,
    maxDistance: 15.0
  });
  
  const [timeRanges, setTimeRanges] = useState([]);
  const [distanceRanges, setDistanceRanges] = useState([]);
  
  const [newTimeRange, setNewTimeRange] = useState({
    startTime: '18:00',
    endTime: '23:59',
    multiplier: 1.5,
    days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
  });
  
  const [newDistanceRange, setNewDistanceRange] = useState({
    minDistance: 5.0,
    maxDistance: 10.0,
    feePerKm: 2.0
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    fetchDeliveryFeeConfig();
  }, []);
  
  const fetchDeliveryFeeConfig = async () => {
    try {
      setLoading(true);
      
      const response = await api.get('/delivery-fee/config');
      
      setBaseConfig(response.data.baseConfig);
      setTimeRanges(response.data.timeRanges);
      setDistanceRanges(response.data.distanceRanges);
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar configurações de taxa de entrega:', error);
      setLoading(false);
      
      // Dados simulados para demonstração
      setTimeout(() => {
        const mockBaseConfig = {
          baseFee: 5.0,
          feePerKm: 1.5,
          minDistance: 1.0,
          maxDistance: 15.0
        };
        
        const mockTimeRanges = [
          {
            id: '1',
            startTime: '18:00',
            endTime: '23:59',
            multiplier: 1.5,
            days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
          },
          {
            id: '2',
            startTime: '00:00',
            endTime: '23:59',
            multiplier: 1.8,
            days: ['SATURDAY', 'SUNDAY']
          }
        ];
        
        const mockDistanceRanges = [
          {
            id: '1',
            minDistance: 5.0,
            maxDistance: 10.0,
            feePerKm: 2.0
          },
          {
            id: '2',
            minDistance: 10.0,
            maxDistance: 15.0,
            feePerKm: 2.5
          }
        ];
        
        setBaseConfig(mockBaseConfig);
        setTimeRanges(mockTimeRanges);
        setDistanceRanges(mockDistanceRanges);
        setLoading(false);
      }, 500);
    }
  };
  
  const saveConfig = async () => {
    try {
      setSaving(true);
      
      await api.put('/delivery-fee/config', {
        baseConfig,
        timeRanges,
        distanceRanges
      });
      
      alert('Configurações salvas com sucesso!');
      setSaving(false);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
      setSaving(false);
    }
  };
  
  const addTimeRange = () => {
    // Validar se há sobreposição de horários
    const hasOverlap = timeRanges.some(range => {
      const daysOverlap = range.days.some(day => newTimeRange.days.includes(day));
      
      if (!daysOverlap) return false;
      
      const newStart = convertTimeToMinutes(newTimeRange.startTime);
      const newEnd = convertTimeToMinutes(newTimeRange.endTime);
      const rangeStart = convertTimeToMinutes(range.startTime);
      const rangeEnd = convertTimeToMinutes(range.endTime);
      
      return (
        (newStart >= rangeStart && newStart <= rangeEnd) ||
        (newEnd >= rangeStart && newEnd <= rangeEnd) ||
        (newStart <= rangeStart && newEnd >= rangeEnd)
      );
    });
    
    if (hasOverlap) {
      alert('Existe sobreposição de horários com outra faixa já cadastrada.');
      return;
    }
    
    setTimeRanges([...timeRanges, { ...newTimeRange, id: Date.now().toString() }]);
    setNewTimeRange({
      startTime: '18:00',
      endTime: '23:59',
      multiplier: 1.5,
      days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
    });
  };
  
  const addDistanceRange = () => {
    // Validar se há sobreposição de distâncias
    const hasOverlap = distanceRanges.some(range => {
      return (
        (newDistanceRange.minDistance >= range.minDistance && newDistanceRange.minDistance <= range.maxDistance) ||
        (newDistanceRange.maxDistance >= range.minDistance && newDistanceRange.maxDistance <= range.maxDistance) ||
        (newDistanceRange.minDistance <= range.minDistance && newDistanceRange.maxDistance >= range.maxDistance)
      );
    });
    
    if (hasOverlap) {
      alert('Existe sobreposição de distâncias com outra faixa já cadastrada.');
      return;
    }
    
    setDistanceRanges([...distanceRanges, { ...newDistanceRange, id: Date.now().toString() }]);
    setNewDistanceRange({
      minDistance: 5.0,
      maxDistance: 10.0,
      feePerKm: 2.0
    });
  };
  
  const removeTimeRange = (id) => {
    setTimeRanges(timeRanges.filter(range => range.id !== id));
  };
  
  const removeDistanceRange = (id) => {
    setDistanceRanges(distanceRanges.filter(range => range.id !== id));
  };
  
  const convertTimeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  const handleDaySelection = (day) => {
    const currentDays = [...newTimeRange.days];
    
    if (currentDays.includes(day)) {
      setNewTimeRange({
        ...newTimeRange,
        days: currentDays.filter(d => d !== day)
      });
    } else {
      setNewTimeRange({
        ...newTimeRange,
        days: [...currentDays, day]
      });
    }
  };
  
  const getDayLabel = (day) => {
    switch (day) {
      case 'MONDAY': return 'Segunda';
      case 'TUESDAY': return 'Terça';
      case 'WEDNESDAY': return 'Quarta';
      case 'THURSDAY': return 'Quinta';
      case 'FRIDAY': return 'Sexta';
      case 'SATURDAY': return 'Sábado';
      case 'SUNDAY': return 'Domingo';
      default: return day;
    }
  };
  
  const formatDaysList = (days) => {
    if (days.length === 7) return 'Todos os dias';
    
    if (
      days.includes('MONDAY') &&
      days.includes('TUESDAY') &&
      days.includes('WEDNESDAY') &&
      days.includes('THURSDAY') &&
      days.includes('FRIDAY') &&
      !days.includes('SATURDAY') &&
      !days.includes('SUNDAY')
    ) {
      return 'Segunda a Sexta';
    }
    
    if (
      !days.includes('MONDAY') &&
      !days.includes('TUESDAY') &&
      !days.includes('WEDNESDAY') &&
      !days.includes('THURSDAY') &&
      !days.includes('FRIDAY') &&
      days.includes('SATURDAY') &&
      days.includes('SUNDAY')
    ) {
      return 'Sábado e Domingo';
    }
    
    return days.map(day => getDayLabel(day)).join(', ');
  };
  
  if (loading) {
    return <p>Carregando configurações...</p>;
  }
  
  return (
    <Container>
      <Header>
        <Title>Configuração de Taxas de Entrega</Title>
        <Button primary onClick={saveConfig} disabled={saving}>
          <FaSave /> {saving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </Header>
      
      <Card>
        <SectionTitle>
          <FaMoneyBillWave /> Configurações Básicas
        </SectionTitle>
        
        <FormRow>
          <FormGroup>
            <Label>Taxa Base (R$)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={baseConfig.baseFee}
              onChange={(e) => setBaseConfig({ ...baseConfig, baseFee: parseFloat(e.target.value) })}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Taxa por Km (R$)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={baseConfig.feePerKm}
              onChange={(e) => setBaseConfig({ ...baseConfig, feePerKm: parseFloat(e.target.value) })}
            />
          </FormGroup>
        </FormRow>
        
        <FormRow>
          <FormGroup>
            <Label>Distância Mínima (km)</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              value={baseConfig.minDistance}
              onChange={(e) => setBaseConfig({ ...baseConfig, minDistance: parseFloat(e.target.value) })}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Distância Máxima (km)</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              value={baseConfig.maxDistance}
              onChange={(e) => setBaseConfig({ ...baseConfig, maxDistance: parseFloat(e.target.value) })}
            />
          </FormGroup>
        </FormRow>
        
        <InfoText>
          A taxa base é cobrada para todas as entregas, independentemente da distância.
          A taxa por km é multiplicada pela distância percorrida.
        </InfoText>
      </Card>
      
      <Card>
        <SectionTitle>
          <FaClock /> Faixas de Horário
        </SectionTitle>
        
        <InfoText>
          Configure multiplicadores de taxa para horários específicos (ex: horário de pico, finais de semana).
          O multiplicador será aplicado sobre a taxa total calculada.
        </InfoText>
        
        <FormRow>
          <FormGroup>
            <Label>Horário Inicial</Label>
            <Input
              type="time"
              value={newTimeRange.startTime}
              onChange={(e) => setNewTimeRange({ ...newTimeRange, startTime: e.target.value })}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Horário Final</Label>
            <Input
              type="time"
              value={newTimeRange.endTime}
              onChange={(e) => setNewTimeRange({ ...newTimeRange, endTime: e.target.value })}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Multiplicador</Label>
            <Input
              type="number"
              step="0.1"
              min="1"
              value={newTimeRange.multiplier}
              onChange={(e) => setNewTimeRange({ ...newTimeRange, multiplier: parseFloat(e.target.value) })}
            />
          </FormGroup>
        </FormRow>
        
        <FormGroup>
          <Label>Dias da Semana</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(day => (
              <Button
                key={day}
                onClick={() => handleDaySelection(day)}
                style={{
                  backgroundColor: newTimeRange.days.includes(day) ? '#3b82f6' : 'white',
                  color: newTimeRange.days.includes(day) ? 'white' : '#1e293b',
                }}
              >
                {getDayLabel(day)}
              </Button>
            ))}
          </div>
        </FormGroup>
        
        <Button onClick={addTimeRange}>
          <FaPlus /> Adicionar Faixa de Horário
        </Button>
        
        {timeRanges.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <Th>Dias</Th>
                <Th>Horário</Th>
                <Th>Multiplicador</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {timeRanges.map(range => (
                <tr key={range.id}>
                  <Td>{formatDaysList(range.days)}</Td>
                  <Td>{range.startTime} - {range.endTime}</Td>
                  <Td>{range.multiplier}x</Td>
                  <Td>
                    <ActionButton delete onClick={() => removeTimeRange(range.id)}>
                      <FaTrash />
                    </ActionButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <InfoText style={{ marginTop: '16px' }}>
            Nenhuma faixa de horário configurada.
          </InfoText>
        )}
      </Card>
      
      <Card>
        <SectionTitle>
          <FaRoute /> Faixas de Distância
        </SectionTitle>
        
        <InfoText>
          Configure taxas específicas por km para diferentes faixas de distância.
          Estas taxas substituirão a taxa por km padrão quando a distância estiver dentro da faixa.
        </InfoText>
        
        <FormRow>
          <FormGroup>
            <Label>Distância Mínima (km)</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              value={newDistanceRange.minDistance}
              onChange={(e) => setNewDistanceRange({ ...newDistanceRange, minDistance: parseFloat(e.target.value) })}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Distância Máxima (km)</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              value={newDistanceRange.maxDistance}
              onChange={(e) => setNewDistanceRange({ ...newDistanceRange, maxDistance: parseFloat(e.target.value) })}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Taxa por Km (R$)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={newDistanceRange.feePerKm}
              onChange={(e) => setNewDistanceRange({ ...newDistanceRange, feePerKm: parseFloat(e.target.value) })}
            />
          </FormGroup>
        </FormRow>
        
        <Button onClick={addDistanceRange}>
          <FaPlus /> Adicionar Faixa de Distância
        </Button>
        
        {distanceRanges.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <Th>Distância Mínima</Th>
                <Th>Distância Máxima</Th>
                <Th>Taxa por Km</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {distanceRanges.map(range => (
                <tr key={range.id}>
                  <Td>{range.minDistance} km</Td>
                  <Td>{range.maxDistance} km</Td>
                  <Td>R$ {range.feePerKm.toFixed(2)}</Td>
                  <Td>
                    <ActionButton delete onClick={() => removeDistanceRange(range.id)}>
                      <FaTrash />
                    </ActionButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <InfoText style={{ marginTop: '16px' }}>
            Nenhuma faixa de distância configurada.
          </InfoText>
        )}
      </Card>
    </Container>
  );
};

export default DeliveryFeeConfig;
