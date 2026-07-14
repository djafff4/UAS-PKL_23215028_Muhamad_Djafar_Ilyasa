import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStaffApi } from '@/composables/useStaffApi'
import type { StaffContract, StaffAppointmentLetter, StaffWorkCertificate, StaffTerminationLetter } from '@/types'

export const useStaffLettersStore = defineStore('staffLetters', () => {
  const contracts = ref<StaffContract[]>([])
  const appointments = ref<StaffAppointmentLetter[]>([])
  const workCertificates = ref<StaffWorkCertificate[]>([])
  const terminationLetters = ref<StaffTerminationLetter[]>([])
  const loading = ref(false)

  async function fetchContracts(staffId: string) {
    loading.value = true
    try {
      const res: any = await useStaffApi(`/staff/users/${staffId}/contracts`)
      if (res.success) {
        contracts.value = res.data || []
      } else {
        contracts.value = []
      }
    } catch (err: any) {
      // 404 means no data yet, not an error
      if (err?.status === 404 || err?.message?.includes('404')) {
        contracts.value = []
      }
    } finally {
      loading.value = false
    }
  }

  async function createContract(staffId: string, data: any) {
    const res: any = await useStaffApi(`/staff/users/${staffId}/contracts`, {
      method: 'POST',
      body: data,
    })
    if (res?.success && res?.data) {
      contracts.value.unshift(res.data)
    }
    return res
  }

  async function updateContract(staffId: string, contractId: string, data: any) {
    const res: any = await useStaffApi(`/staff/users/${staffId}/contracts/${contractId}`, {
      method: 'PUT',
      body: data,
    })
    if (res?.success) {
      const idx = contracts.value.findIndex(c => c.id === contractId)
      if (idx >= 0 && res?.data) contracts.value[idx] = res.data
    }
    return res
  }

  async function deleteContract(staffId: string, contractId: string) {
    const res: any = await useStaffApi(`/staff/users/${staffId}/contracts/${contractId}`, {
      method: 'DELETE',
    })
    if (res?.success) {
      contracts.value = contracts.value.filter(c => c.id !== contractId)
    }
    return res
  }

  async function fetchAppointments(staffId: string) {
    loading.value = true
    try {
      const res: any = await useStaffApi(`/staff/users/${staffId}/appointments`)
      if (res.success) {
        appointments.value = res.data || []
      } else {
        appointments.value = []
      }
    } catch (err: any) {
      // 404 means no data yet, not an error
      if (err?.status === 404 || err?.message?.includes('404')) {
        appointments.value = []
      }
    } finally {
      loading.value = false
    }
  }

  async function createAppointment(staffId: string, data: any) {
    const res: any = await useStaffApi(`/staff/users/${staffId}/appointments`, {
      method: 'POST',
      body: data,
    })
    if (res?.success && res?.data) {
      appointments.value.unshift(res.data)
    }
    return res
  }

  async function updateAppointment(staffId: string, appointmentId: string, data: any) {
    const res: any = await useStaffApi(`/staff/users/${staffId}/appointments/${appointmentId}`, {
      method: 'PUT',
      body: data,
    })
    if (res?.success) {
      const idx = appointments.value.findIndex(a => a.id === appointmentId)
      if (idx >= 0 && res?.data) appointments.value[idx] = res.data
    }
    return res
  }

  async function deleteAppointment(staffId: string, appointmentId: string) {
    const res: any = await useStaffApi(`/staff/users/${staffId}/appointments/${appointmentId}`, {
      method: 'DELETE',
    })
    if (res?.success) {
      appointments.value = appointments.value.filter(a => a.id !== appointmentId)
    }
    return res
  }

  async function fetchWorkCertificates(staffId: string) {
    loading.value = true
    try {
      const res: any = await useStaffApi(`/staff/users/${staffId}/work-certificates`)
      if (res.success) {
        workCertificates.value = res.data || []
      } else {
        workCertificates.value = []
      }
    } catch (err: any) {
      if (err?.status === 404 || err?.message?.includes('404')) {
        workCertificates.value = []
      }
    } finally {
      loading.value = false
    }
  }

  async function createWorkCertificate(staffId: string, data: any) {
    const res: any = await useStaffApi(`/staff/users/${staffId}/work-certificates`, {
      method: 'POST',
      body: data,
    })
    if (res?.success && res?.data) {
      workCertificates.value.unshift(res.data)
    }
    return res
  }

  async function updateWorkCertificate(staffId: string, certId: string, data: any) {
    const res: any = await useStaffApi(`/staff/users/${staffId}/work-certificates/${certId}`, {
      method: 'PUT',
      body: data,
    })
    if (res?.success) {
      const idx = workCertificates.value.findIndex(c => c.id === certId)
      if (idx >= 0 && res?.data) workCertificates.value[idx] = res.data
    }
    return res
  }

  async function deleteWorkCertificate(staffId: string, certId: string) {
    const res: any = await useStaffApi(`/staff/users/${staffId}/work-certificates/${certId}`, {
      method: 'DELETE',
    })
    if (res?.success) {
      workCertificates.value = workCertificates.value.filter(c => c.id !== certId)
    }
    return res
  }

  async function fetchTerminationLetters(staffId: string) {
    loading.value = true
    try {
      const res: any = await useStaffApi(`/staff/users/${staffId}/termination-letters`)
      if (res.success) {
        terminationLetters.value = res.data || []
      } else {
        terminationLetters.value = []
      }
    } catch (err: any) {
      if (err?.status === 404 || err?.message?.includes('404')) {
        terminationLetters.value = []
      }
    } finally {
      loading.value = false
    }
  }

  async function createTerminationLetter(staffId: string, data: any) {
    const res: any = await useStaffApi(`/staff/users/${staffId}/termination-letters`, {
      method: 'POST',
      body: data,
    })
    if (res?.success && res?.data) {
      terminationLetters.value.unshift(res.data)
    }
    return res
  }

  async function updateTerminationLetter(staffId: string, termId: string, data: any) {
    const res: any = await useStaffApi(`/staff/users/${staffId}/termination-letters/${termId}`, {
      method: 'PUT',
      body: data,
    })
    if (res?.success) {
      const idx = terminationLetters.value.findIndex(t => t.id === termId)
      if (idx >= 0 && res?.data) terminationLetters.value[idx] = res.data
    }
    return res
  }

  async function deleteTerminationLetter(staffId: string, termId: string) {
    const res: any = await useStaffApi(`/staff/users/${staffId}/termination-letters/${termId}`, {
      method: 'DELETE',
    })
    if (res?.success) {
      terminationLetters.value = terminationLetters.value.filter(t => t.id !== termId)
    }
    return res
  }

  return {
    contracts, appointments, workCertificates, terminationLetters, loading,
    fetchContracts, createContract, updateContract, deleteContract,
    fetchAppointments, createAppointment, updateAppointment, deleteAppointment,
    fetchWorkCertificates, createWorkCertificate, updateWorkCertificate, deleteWorkCertificate,
    fetchTerminationLetters, createTerminationLetter, updateTerminationLetter, deleteTerminationLetter,
  }
})
