import React, { useState, useRef } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Image as ImageIcon, 
  Smile, 
  Pin, 
  Trash2, 
  Sparkles, 
  Camera, 
  Plus, 
  Share2, 
  Check, 
  Tag,
  Edit3,
  Upload,
  X
} from 'lucide-react';
import { Post, MemberId, FamilyMember } from '../types';
import { FAMILY_MEMBERS } from '../data/initialData';

interface FeedSectionProps {
  posts: Post[];
  activeMemberId: MemberId;
  onAddPost: (newPost: Omit<Post, 'id' | 'timestamp' | 'formattedDate' | 'likes' | 'comments'>) => void;
  onEditPost?: (post: Post) => void;
  onToggleLike: (postId: string, memberId: MemberId) => void;
  onAddComment: (postId: string, text: string, authorId: MemberId) => void;
  onDeletePost: (postId: string) => void;
  onTogglePin: (postId: string) => void;
  familyMembers?: Record<string, FamilyMember>;
}

const PRESET_PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop&q=80', label: 'Aria w parku' },
  { url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80', label: 'Rysunek malucha' },
  { url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80', label: 'Pyszny obiad' },
  { url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80', label: 'Zabawa klockami' },
  { url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&auto=format&fit=crop&q=80', label: 'Śpiąca Aria' },
  { url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=80', label: 'Wycieczka do lasu' }
];

const MOOD_OPTIONS = [
  '🥰 Szczęśliwa / Dumny',
  '☕ Poranny chill',
  '🐾 Spacer z Arią',
  '🎨 Kreatywny Tymek',
  '😋 Pycha jedzonko',
  '🌿 Spokój & Dom',
  '🏃 W biegu'
];

export const FeedSection: React.FC<FeedSectionProps> = ({
  posts,
  activeMemberId,
  onAddPost,
  onEditPost,
  onToggleLike,
  onAddComment,
  onDeletePost,
  onTogglePin,
  familyMembers = FAMILY_MEMBERS
}) => {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [selectedMood, setSelectedMood] = useState('🥰 Szczęśliwa / Dumny');
  const [selectedTag, setSelectedTag] = useState('');
  const [activeFilterTag, setActiveFilterTag] = useState<string>('all');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState(false);

  // Edit Post Modal State
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const activeAuthor = familyMembers[activeMemberId] || familyMembers.mama || FAMILY_MEMBERS.mama;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (isEditing && editingPost) {
          setEditingPost({
            ...editingPost,
            mediaUrl: reader.result,
            mediaType: 'image'
          });
        } else {
          setMediaUrl(reader.result);
          setShowPhotoPicker(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaUrl) return;

    onAddPost({
      authorId: activeMemberId,
      content: content.trim(),
      mediaUrl: mediaUrl || undefined,
      mediaType: mediaUrl ? 'image' : undefined,
      mood: selectedMood || undefined,
      tag: selectedTag.trim() || undefined,
      pinned: false
    });

    setContent('');
    setMediaUrl('');
    setSelectedTag('');
    setShowPhotoPicker(false);
    setShowMoodPicker(false);
    setCustomUrlInput(false);
  };

  const handleSaveEditedPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !onEditPost) return;

    onEditPost(editingPost);
    setEditingPost(null);
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    onAddComment(postId, text.trim(), activeMemberId);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  // Collect unique tags
  const tags = Array.from(new Set(posts.map((p) => p.tag).filter(Boolean))) as string[];

  const filteredPosts = posts.filter((post) => {
    if (activeFilterTag === 'all') return true;
    return post.tag === activeFilterTag;
  });

  // Sort pinned first
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-12">
      
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 border border-amber-200/60 rounded-3xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-stone-900 font-['Outfit',sans-serif]">
                Rodzinna Oś Czasu
              </h2>
            </div>
            <p className="text-sm text-stone-600">
              Nasza prywatna przestrzeń na zdjęcia, codzienne małe sukcesy, cytaty Tymka i przygody Arii.
            </p>
          </div>
          <div className="flex items-center -space-x-2 self-start sm:self-center">
            {Object.values(FAMILY_MEMBERS).map((m) => (
              <img
                key={m.id}
                src={m.avatar}
                alt={m.name}
                title={m.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-2xs"
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
        </div>
      </div>

      {/* New Post Box */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-4 sm:p-5 shadow-xs transition-all">
        <form onSubmit={handleSubmitPost} className="space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={activeAuthor.avatar}
              alt={activeAuthor.name}
              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-amber-200"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1">
              <p className="text-xs font-semibold text-stone-800">
                Wpis jako: <span className="text-amber-700 font-bold">{activeAuthor.name}</span> ({activeAuthor.role})
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                  {selectedMood}
                </span>
                {selectedTag && (
                  <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    #{selectedTag}
                  </span>
                )}
              </div>
            </div>
          </div>

          <textarea
            id="post-content-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Co słychać u Was dzisiaj, ${activeAuthor.name}? Wpisz wspomnienie, sukces, śmieszną sytuację...`}
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 focus:border-amber-400 focus:ring-3 focus:ring-amber-100 outline-none text-sm text-stone-800 placeholder-stone-400 resize-none bg-[#fdfcfb]"
          />

          {/* Media Preview if selected */}
          {mediaUrl && (
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 max-h-64 bg-stone-100">
              <img
                src={mediaUrl}
                alt="Podgląd załącznika"
                className="w-full h-48 sm:h-60 object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => setMediaUrl('')}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 text-xs"
              >
                ✕ Usuń zdjęcie
              </button>
            </div>
          )}

          {/* Preset Photo Selector Tray */}
          {showPhotoPicker && (
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-700">Wybierz zdjęcie z albumu lub wklej link:</span>
                <button
                  type="button"
                  onClick={() => setCustomUrlInput(!customUrlInput)}
                  className="text-xs text-amber-700 hover:underline font-medium"
                >
                  {customUrlInput ? 'Wybierz z miniatur' : 'Własny link URL'}
                </button>
              </div>

              {customUrlInput ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    placeholder="Wklej adres URL zdjęcia..."
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white"
                  />
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleFileUpload(e, false)}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-xl flex items-center gap-1.5 border border-stone-200 whitespace-nowrap"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Wgraj z pliku
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPhotoPicker(false)}
                      className="px-3 py-1.5 bg-amber-600 text-white text-xs rounded-xl font-medium"
                    >
                      Gotowe
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleFileUpload(e, false)}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs rounded-xl flex items-center justify-center gap-2 border border-amber-200 font-semibold transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-700" />
                      Wgraj własne zdjęcie z telefonu lub komputera
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {PRESET_PHOTOS.map((photo, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setMediaUrl(photo.url);
                          setShowPhotoPicker(false);
                        }}
                        className={`group relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                          mediaUrl === photo.url ? 'border-amber-500 scale-95' : 'border-transparent hover:border-amber-300'
                        }`}
                      >
                        <img
                          src={photo.url}
                          alt={photo.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-black/60 text-[9px] text-white p-0.5 text-center truncate">
                          {photo.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mood and Tag Pickers */}
          {showMoodPicker && (
            <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2">
              <p className="text-xs font-semibold text-stone-700">Wybierz nastrój wpisu:</p>
              <div className="flex flex-wrap gap-1.5">
                {MOOD_OPTIONS.map((mood) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => {
                      setSelectedMood(mood);
                      setShowMoodPicker(false);
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                      selectedMood === mood
                        ? 'bg-amber-600 text-white font-medium shadow-2xs'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-amber-200/60 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-stone-500" />
                <input
                  type="text"
                  placeholder="Dodaj tag (np. Wycieczka, Przedszkole)..."
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="text-xs px-2.5 py-1 rounded-lg border border-stone-200 bg-white flex-1"
                />
              </div>
            </div>
          )}

          {/* Actions Bottom Bar */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setShowPhotoPicker(!showPhotoPicker)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                  showPhotoPicker || mediaUrl
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Camera className="w-4 h-4 text-amber-600" />
                <span className="hidden xs:inline">Zdjęcie</span>
              </button>

              <button
                type="button"
                onClick={() => setShowMoodPicker(!showMoodPicker)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                  showMoodPicker
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Smile className="w-4 h-4 text-amber-600" />
                <span className="hidden xs:inline">Nastrój & Tag</span>
              </button>
            </div>

            <button
              id="submit-post-btn"
              type="submit"
              disabled={!content.trim() && !mediaUrl}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:pointer-events-none text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              Dodaj wpis
            </button>
          </div>
        </form>
      </div>

      {/* Filter Tabs */}
      {tags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveFilterTag('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeFilterTag === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
            }`}
          >
            Wszystkie wpisy ({posts.length})
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilterTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                activeFilterTag === tag
                  ? 'bg-amber-700 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Feed Stream */}
      <div className="space-y-5">
        {sortedPosts.map((post) => {
          const author = FAMILY_MEMBERS[post.authorId] || FAMILY_MEMBERS.mama;
          const hasLiked = post.likes.includes(activeMemberId);
          const postComments = post.comments || [];

          return (
            <article
              key={post.id}
              className={`bg-white rounded-3xl border transition-shadow shadow-xs hover:shadow-md ${
                post.pinned
                  ? 'border-amber-300 ring-1 ring-amber-200/80 bg-gradient-to-b from-amber-50/30 to-white'
                  : 'border-stone-200/90'
              }`}
            >
              {/* Post Header */}
              <div className="p-4 sm:p-5 pb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-11 h-11 rounded-2xl object-cover ring-2 ring-amber-300/40"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-stone-900">
                        {author.name}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${author.badgeBg}`}>
                        {author.role}
                      </span>
                      {post.pinned && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                          <Pin className="w-2.5 h-2.5 fill-amber-700 text-amber-700" />
                          Przypięte
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                      <span>{post.formattedDate}</span>
                      {post.mood && <span>• {post.mood}</span>}
                    </div>
                  </div>
                </div>

                {/* Edit / Pin / Delete Menu */}
                <div className="flex items-center gap-1 text-stone-400">
                  <button
                    onClick={() => setEditingPost(post)}
                    title="Edytuj treść lub zdjęcie wpisu"
                    className="p-1.5 rounded-lg hover:text-amber-700 hover:bg-amber-50 transition-colors text-stone-400"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onTogglePin(post.id)}
                    title={post.pinned ? 'Odepnij wpis' : 'Przypnij na górze'}
                    className={`p-1.5 rounded-lg hover:bg-stone-100 transition-colors ${
                      post.pinned ? 'text-amber-600' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Czy na pewno chcesz usunąć ten wpis z tablicy?')) {
                        onDeletePost(post.id);
                      }
                    }}
                    title="Usuń wpis"
                    className="p-1.5 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-4 sm:px-5 pb-3">
                <p className="text-sm sm:text-base text-stone-800 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
                {post.tag && (
                  <span className="inline-block mt-2 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
                    #{post.tag}
                  </span>
                )}
              </div>

              {/* Post Image */}
              {post.mediaUrl && (
                <div className="px-4 sm:px-5 pb-3">
                  <div className="rounded-2xl overflow-hidden border border-stone-200/80 bg-stone-100 shadow-2xs">
                    <img
                      src={post.mediaUrl}
                      alt="Zdjęcie z wpisu"
                      className="w-full max-h-96 object-cover hover:scale-[1.01] transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              )}

              {/* Likes & Reactions Bar */}
              <div className="px-4 sm:px-5 py-2.5 border-t border-stone-100 bg-[#fdfcfb]/80 rounded-b-3xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleLike(post.id, activeMemberId)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-90 ${
                      hasLiked
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
                    <span>{post.likes.length}</span>
                  </button>

                  {/* Who liked avatars */}
                  {post.likes.length > 0 && (
                    <div className="flex items-center -space-x-1.5">
                      {post.likes.map((likerId) => {
                        const m = familyMembers[likerId] || familyMembers.mama || FAMILY_MEMBERS[likerId];
                        if (!m) return null;
                        return (
                          <img
                            key={m.id}
                            src={m.avatar}
                            alt={m.name}
                            title={`Polubione przez: ${m.name}`}
                            className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
                            referrerPolicy="no-referrer"
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <MessageCircle className="w-4 h-4 text-stone-400" />
                  <span>{postComments.length} {postComments.length === 1 ? 'komentarz' : 'komentarzy'}</span>
                </div>
              </div>

              {/* Comments Thread */}
              <div className="px-4 sm:px-5 py-3 bg-stone-50/60 border-t border-stone-100 rounded-b-3xl space-y-2.5">
                {postComments.map((comment) => {
                  const commentAuthor = familyMembers[comment.authorId] || familyMembers.mama || FAMILY_MEMBERS.mama;
                  return (
                    <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                      <img
                        src={commentAuthor.avatar}
                        alt={commentAuthor.name}
                        className="w-7 h-7 rounded-lg object-cover ring-1 ring-stone-200 mt-0.5"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 bg-white border border-stone-200/80 rounded-2xl px-3 py-2 shadow-2xs">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-stone-900">{commentAuthor.name}</span>
                          <span className="text-[10px] text-stone-400">{comment.timestamp}</span>
                        </div>
                        <p className="text-stone-700">{comment.text}</p>
                      </div>
                    </div>
                  );
                })}

                {/* Comment Input */}
                <div className="flex items-center gap-2 pt-1">
                  <img
                    src={activeAuthor.avatar}
                    alt={activeAuthor.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-amber-200"
                    referrerPolicy="no-referrer"
                  />
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCommentSubmit(post.id);
                      }
                    }}
                    placeholder={`Napisz komentarz jako ${activeAuthor.name}...`}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  />
                  <button
                    type="button"
                    onClick={() => handleCommentSubmit(post.id)}
                    disabled={!commentInputs[post.id]?.trim()}
                    className="p-1.5 rounded-xl bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </article>
          );
        })}
      </div>

      {/* EDIT POST MODAL */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-bold text-stone-900">
                  Edytuj wpis na tablicy
                </h3>
              </div>
              <button
                onClick={() => setEditingPost(null)}
                className="text-stone-400 hover:text-stone-700 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditedPost} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Treść wpisu
                </label>
                <textarea
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Zdjęcie do wpisu (plik lub URL)
                </label>
                {editingPost.mediaUrl && (
                  <div className="relative mb-2 rounded-xl overflow-hidden border border-stone-200 max-h-48 bg-stone-100">
                    <img
                      src={editingPost.mediaUrl}
                      alt="Podgląd"
                      className="w-full h-36 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => setEditingPost({ ...editingPost, mediaUrl: undefined, mediaType: undefined })}
                      className="absolute top-2 right-2 p-1 px-2 rounded-full bg-black/60 text-white hover:bg-black/80 text-[11px]"
                    >
                      ✕ Usuń zdjęcie
                    </button>
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={editFileInputRef}
                    onChange={(e) => handleFileUpload(e, true)}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs rounded-xl flex items-center gap-1.5 border border-stone-200 font-semibold"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Wgraj nowe zdjęcie z pliku
                  </button>
                </div>

                <input
                  type="url"
                  placeholder="Lub wklej link do zdjęcia (URL)..."
                  value={editingPost.mediaUrl || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, mediaUrl: e.target.value, mediaType: e.target.value ? 'image' : undefined })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nastrój
                  </label>
                  <select
                    value={editingPost.mood || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, mood: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                  >
                    <option value="">(Brak)</option>
                    {MOOD_OPTIONS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tag wpisu
                  </label>
                  <input
                    type="text"
                    placeholder="np. Spacer, Wycieczka"
                    value={editingPost.tag || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, tag: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
                >
                  Zapisz zmiany
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
