import { useState, useMemo } from 'react'; // Added useMemo
import { supabase } from '../lib/supabase';
import { useSyllabus } from '../features/syllabus/api/useSyllabus';
import { useBranches } from '../features/syllabus/hooks/useBranches';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tab';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2, BookPlus, GitBranch, Layers, ListPlus, Youtube } from 'lucide-react';

export function AdminUploadPage() {
  const [activeTab, setActiveTab] = useState('upload');
  
  // Shared State
  const [branch, setBranch] = useState('Computer Science Engineering');
  const [semester, setSemester] = useState('3');
  const [adminPin, setAdminPin] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  // Upload State
  const [subjectName, setSubjectName] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Note');
  const [file, setFile] = useState(null);

  // New Branch/Subject/Unit State
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchCode, setNewBranchCode] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  
  const [targetSubject, setTargetSubject] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [unitTitle, setUnitTitle] = useState('');

  // NEW: Add Topic State
  const [topicSubject, setTopicSubject] = useState('');
  const [topicUnitId, setTopicUnitId] = useState('');
  const [topicName, setTopicName] = useState('');
  const [topicYoutubeUrl, setTopicYoutubeUrl] = useState('');

  // Hooks
  const { syllabus } = useSyllabus(branch, parseInt(semester));
  const { branches } = useBranches();

  // Helper: Get units for the selected subject (for the Topic section)
  const availableUnits = useMemo(() => {
    if (!topicSubject || !syllabus) return [];
    const subj = syllabus.find(s => s.name === topicSubject);
    return subj ? subj.units : [];
  }, [topicSubject, syllabus]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const validatePin = () => {
    if (adminPin !== '1234') {
      setStatus({ type: 'error', message: 'Invalid Admin PIN' });
      return false;
    }
    return true;
  };

  // --- 1. Add Branch ---
  const handleAddBranch = async () => {
    if (!validatePin()) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('branches').insert([{ name: newBranchName, short_code: newBranchCode }]);
      if (error) throw error;
      setStatus({ type: 'success', message: `Branch '${newBranchName}' added!` });
      setNewBranchName(''); setNewBranchCode('');
      window.location.reload(); 
    } catch (err) { setStatus({ type: 'error', message: err.message }); } finally { setLoading(false); }
  };

  // --- 2. Add Subject ---
  const handleAddSubject = async () => {
    if (!validatePin()) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('subjects').insert([{
        name: newSubjectName, code: newSubjectCode, branch, semester: parseInt(semester), credits: 4
      }]);
      if (error) throw error;
      setStatus({ type: 'success', message: `Subject '${newSubjectName}' created!` });
      setNewSubjectName(''); setNewSubjectCode('');
    } catch (err) { setStatus({ type: 'error', message: err.message }); } finally { setLoading(false); }
  };

  // --- 3. Add Unit ---
  const handleAddUnit = async () => {
    if (!validatePin()) return;
    setLoading(true);
    try {
      const selectedSubjectObj = syllabus.find(s => s.name === targetSubject);
      if (!selectedSubjectObj) throw new Error("Subject not found.");

      const { error } = await supabase.from('units').insert([{
        subject_id: selectedSubjectObj.id, unit_number: parseInt(unitNumber), title: unitTitle
      }]);

      if (error) throw error;
      setStatus({ type: 'success', message: `Unit ${unitNumber} added!` });
      setUnitTitle(''); setUnitNumber(prev => (parseInt(prev) + 1).toString()); 
    } catch (err) { setStatus({ type: 'error', message: err.message }); } finally { setLoading(false); }
  };

  // --- 4. Add Topic (NEW) ---
  const handleAddTopic = async () => {
    if (!validatePin()) return;
    if (!topicUnitId || !topicName) {
      setStatus({ type: 'error', message: 'Select a unit and enter a topic name.' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('topics').insert([{
        unit_id: topicUnitId,
        title: topicName,
        youtube_url: topicYoutubeUrl || null // Optional
      }]);

      if (error) throw error;

      setStatus({ type: 'success', message: `Topic '${topicName}' added!` });
      setTopicName(''); 
      setTopicYoutubeUrl('');
      // Keep Unit ID selected so you can add next topic quickly
    } catch (err) { setStatus({ type: 'error', message: err.message }); } finally { setLoading(false); }
  };

  // --- 5. Upload File ---
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!validatePin()) return;
    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${title.replace(/\s+/g, '_')}.${fileExt}`;
      const filePath = `${branch}/${semester}/${subjectName}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('study_materials').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('study_materials').getPublicUrl(filePath);
      const { error: dbError } = await supabase.from('study_materials').insert([{
        branch, semester: parseInt(semester), subject_name: subjectName, title, type, file_url: publicUrl,
      }]);
      if (dbError) throw dbError;

      setStatus({ type: 'success', message: 'File uploaded successfully!' });
      setTitle(''); setFile(null);
    } catch (error) { setStatus({ type: 'error', message: error.message }); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex items-start justify-center">
      <Card className="w-full max-w-4xl p-4 sm:p-6 lg:p-8 border-border bg-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <UploadCloud className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Portal</h1>
            <p className="text-muted-foreground">Manage Materials & Curriculum</p>
          </div>
        </div>

        <Tabs defaultValue="manage" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="manage" className="gap-2"><BookPlus className="w-4 h-4" /> Manage Curriculum</TabsTrigger>
            <TabsTrigger value="upload" className="gap-2"><UploadCloud className="w-4 h-4" /> Upload Materials</TabsTrigger>
          </TabsList>

          {/* Global Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="space-y-2">
              <Label>Branch</Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{branches.map(b => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{[1, 2, 3, 4, 5, 6, 7, 8].map(s => <SelectItem key={s} value={s.toString()}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          {/* TAB 1: MANAGE CURRICULUM */}
          <TabsContent value="manage" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* 1. Add Branch */}
              <div className="p-4 border border-border rounded-xl bg-card space-y-3">
                <div className="flex items-center gap-2 mb-1"><GitBranch className="w-4 h-4 text-purple-600" /><h3 className="font-bold">Add Branch</h3></div>
                <Input placeholder="Name" value={newBranchName} onChange={(e) => setNewBranchName(e.target.value)} />
                <Input placeholder="Code (CE)" value={newBranchCode} onChange={(e) => setNewBranchCode(e.target.value)} />
                <Button onClick={handleAddBranch} size="sm" variant="outline" className="w-full" disabled={loading}>Add Branch</Button>
              </div>

              {/* 2. Add Subject */}
              <div className="p-4 border border-border rounded-xl bg-card space-y-3">
                <div className="flex items-center gap-2 mb-1"><BookPlus className="w-4 h-4 text-blue-600" /><h3 className="font-bold">Add Subject</h3></div>
                <Input placeholder="Subject Name" value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} />
                <Input placeholder="Code (CE-101)" value={newSubjectCode} onChange={(e) => setNewSubjectCode(e.target.value)} />
                <Button onClick={handleAddSubject} size="sm" variant="outline" className="w-full" disabled={loading}>Add Subject</Button>
              </div>

              {/* 3. Add Unit */}
              <div className="p-4 border border-border rounded-xl bg-card space-y-3">
                <div className="flex items-center gap-2 mb-1"><Layers className="w-4 h-4 text-green-600" /><h3 className="font-bold">Add Unit</h3></div>
                <Select value={targetSubject} onValueChange={setTargetSubject}>
                  <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                  <SelectContent>{syllabus?.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <Input type="number" placeholder="#" className="sm:col-span-1" value={unitNumber} onChange={(e) => setUnitNumber(e.target.value)} />
                  <Input placeholder="Unit Title" className="sm:col-span-3" value={unitTitle} onChange={(e) => setUnitTitle(e.target.value)} />
                </div>
                <Button onClick={handleAddUnit} size="sm" variant="outline" className="w-full" disabled={loading}>Add Unit</Button>
              </div>

              {/* 4. Add Topic (NEW) */}
              <div className="p-4 border border-border rounded-xl bg-card space-y-3">
                <div className="flex items-center gap-2 mb-1"><ListPlus className="w-4 h-4 text-orange-600" /><h3 className="font-bold">Add Topic</h3></div>
                
                {/* A. Select Subject to Filter Units */}
                <Select value={topicSubject} onValueChange={setTopicSubject}>
                  <SelectTrigger><SelectValue placeholder="1. Pick Subject" /></SelectTrigger>
                  <SelectContent>{syllabus?.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
                </Select>

                {/* B. Select Unit (Filtered) */}
                <Select value={topicUnitId} onValueChange={setTopicUnitId} disabled={!topicSubject}>
                  <SelectTrigger><SelectValue placeholder={topicSubject ? "2. Pick Unit" : "Pick Subject First"} /></SelectTrigger>
                  <SelectContent>
                    {availableUnits.map(u => (
                      <SelectItem key={u.id} value={u.id}>Unit {u.unit_number}: {u.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input placeholder="Topic Name" value={topicName} onChange={(e) => setTopicName(e.target.value)} />
                <div className="relative">
                  <Youtube className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-8" placeholder="YouTube URL (Optional)" value={topicYoutubeUrl} onChange={(e) => setTopicYoutubeUrl(e.target.value)} />
                </div>
                
                <Button onClick={handleAddTopic} size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-white" disabled={loading}>Add Topic</Button>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border">
               <Label>Confirm Action with PIN</Label>
               <Input type="password" placeholder="Enter 1234" value={adminPin} onChange={(e) => setAdminPin(e.target.value)} className="mt-2" />
            </div>
          </TabsContent>

          {/* TAB 2: UPLOAD (Existing) */}
          <TabsContent value="upload" className="space-y-6">
             <div className="space-y-2">
              <Label>Subject</Label>
              <Select value={subjectName} onValueChange={setSubjectName}>
                <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                <SelectContent>{syllabus?.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {/* ... Rest of upload form (Type, Title, File) ... */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Type</Label><Select value={type} onValueChange={setType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Note">Notes / PDF</SelectItem><SelectItem value="PYQ">PYQ</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Title</Label><Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            </div>
            <div className="space-y-2"><Label>File</Label><Input type="file" accept=".pdf" onChange={handleFileChange} /></div>
            <div className="space-y-2"><Label>PIN</Label><Input type="password" placeholder="PIN" value={adminPin} onChange={(e) => setAdminPin(e.target.value)} /></div>
            <Button onClick={handleUpload} className="w-full" disabled={loading}>Upload</Button>
          </TabsContent>

          {status.message && (
            <div className={`mt-6 p-3 rounded-lg flex items-center gap-2 ${status.type === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
              {status.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {status.message}
            </div>
          )}
        </Tabs>
      </Card>
    </div>
  );
}