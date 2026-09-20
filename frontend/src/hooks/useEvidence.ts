import { useState, useCallback } from 'react';
import { evidenceApi } from '../api/client';
import { useAppStore } from '../store/appStore';
import toast from 'react-hot-toast';

export const useEvidence = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { evidenceFiles, setEvidenceFiles } = useAppStore();

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await evidenceApi.list();
      setEvidenceFiles(data as any);
    } catch (err) {
      toast.error('Failed to fetch evidence list');
    } finally {
      setIsLoading(false);
    }
  }, [setEvidenceFiles]);

  const upload = useCallback(async (file: File, type: string) => {
    setIsLoading(true);
    try {
      await evidenceApi.upload(file, type);
      toast.success(`${file.name} uploaded successfully`);
      await refresh();
    } catch (err) {
      toast.error(`Failed to upload ${file.name}`);
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const verify = useCallback(async (fileId: string) => {
    try {
      const data = await evidenceApi.verify(fileId);
      if (data.verified) {
        toast.success('File verification passed');
      } else {
        toast.error('File verification failed');
      }
      await refresh();
      return data.verified;
    } catch (err) {
      toast.error('Error during verification');
      return false;
    }
  }, [refresh]);

  return { files: evidenceFiles, isLoading, upload, verify, refresh };
};
